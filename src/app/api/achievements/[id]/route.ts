import {
  NextRequest,
  NextResponse,
} from "next/server";

import mongoose from "mongoose";

import { getSession } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import Achievement from "@/models/Achievement";
import { achievementSchema } from "@/schemas/achievementSchema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function deleteCloudinaryImage(
  publicId: string
) {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
      }
    );
  } catch (error) {
    console.error(
      `Failed to delete Cloudinary achievement image: ${publicId}`,
      error
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session =
      await getSession();

    if (
      !session ||
      session.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const { id } =
      await context.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid achievement ID",
        },
        {
          status: 400,
        }
      );
    }

    const existingAchievement =
      await Achievement.findById(id);

    if (!existingAchievement) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Achievement not found",
        },
        {
          status: 404,
        }
      );
    }

    const body =
      await request.json();

    const validation =
      achievementSchema.safeParse(
        body
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid achievement data",
          errors:
            validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const newData =
      validation.data;

    const oldImagePublicId =
      existingAchievement.imagePublicId ||
      "";

    const newImagePublicId =
      newData.imagePublicId ||
      "";

    const imageChanged =
      oldImagePublicId &&
      oldImagePublicId !==
        newImagePublicId;

    const achievement =
      await Achievement.findByIdAndUpdate(
        id,
        newData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!achievement) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Achievement not found",
        },
        {
          status: 404,
        }
      );
    }

    if (imageChanged) {
      await deleteCloudinaryImage(
        oldImagePublicId
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Achievement updated successfully",
      achievement,
    });
  } catch (error) {
    console.error(
      "PUT achievement error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update achievement",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session =
      await getSession();

    if (
      !session ||
      session.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const { id } =
      await context.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid achievement ID",
        },
        {
          status: 400,
        }
      );
    }

    const achievement =
      await Achievement.findById(id);

    if (!achievement) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Achievement not found",
        },
        {
          status: 404,
        }
      );
    }

    const imagePublicId =
      achievement.imagePublicId ||
      "";

    await Achievement.findByIdAndDelete(
      id
    );

    if (imagePublicId) {
      await deleteCloudinaryImage(
        imagePublicId
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Achievement deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE achievement error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete achievement",
      },
      {
        status: 500,
      }
    );
  }
}