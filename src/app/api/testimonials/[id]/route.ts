import {
  NextRequest,
  NextResponse,
} from "next/server";

import mongoose from "mongoose";

import { getSession } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { testimonialSchema } from "@/schemas/testimonialSchema";

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
      `Failed to delete testimonial image: ${publicId}`,
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
          message:
            "Unauthorized",
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
            "Invalid testimonial ID",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await Testimonial.findById(
        id
      );

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Testimonial not found",
        },
        {
          status: 404,
        }
      );
    }

    const body =
      await request.json();

    const validation =
      testimonialSchema.safeParse(
        body
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid testimonial data",
          errors:
            validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const oldImagePublicId =
      existing.imagePublicId ||
      "";

    const newImagePublicId =
      validation.data
        .imagePublicId || "";

    const imageChanged =
      oldImagePublicId &&
      oldImagePublicId !==
        newImagePublicId;

    const testimonial =
      await Testimonial.findByIdAndUpdate(
        id,
        validation.data,
        {
          new: true,
          runValidators: true,
        }
      );

    if (imageChanged) {
      await deleteCloudinaryImage(
        oldImagePublicId
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    console.error(
      "PUT testimonial error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update testimonial",
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
          message:
            "Unauthorized",
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
            "Invalid testimonial ID",
        },
        {
          status: 400,
        }
      );
    }

    const testimonial =
      await Testimonial.findById(
        id
      );

    if (!testimonial) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Testimonial not found",
        },
        {
          status: 404,
        }
      );
    }

    const imagePublicId =
      testimonial.imagePublicId ||
      "";

    await Testimonial.findByIdAndDelete(
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
        "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE testimonial error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete testimonial",
      },
      {
        status: 500,
      }
    );
  }
}