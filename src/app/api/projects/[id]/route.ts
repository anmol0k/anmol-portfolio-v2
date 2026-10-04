import {
  NextRequest,
  NextResponse,
} from "next/server";

import mongoose from "mongoose";

import { getSession } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { projectSchema } from "@/schemas/projectSchema";

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
      `Failed to delete Cloudinary image: ${publicId}`,
      error
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
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
            "Invalid project ID",
        },
        {
          status: 400,
        }
      );
    }

    const project =
      await Project.findById(
        id
      ).lean();

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(
      "GET single project error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch project",
      },
      {
        status: 500,
      }
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
            "Invalid project ID",
        },
        {
          status: 400,
        }
      );
    }

    const existingProject =
      await Project.findById(id);

    if (!existingProject) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    const body =
      await request.json();

    const validation =
      projectSchema.safeParse(
        body
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid project data",
          errors:
            validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const duplicateSlug =
      await Project.findOne({
        slug:
          validation.data.slug,

        _id: {
          $ne: id,
        },
      });

    if (duplicateSlug) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Another project already uses this slug",
        },
        {
          status: 409,
        }
      );
    }

    const newData =
      validation.data;

    const oldThumbnailPublicId =
      existingProject.thumbnailPublicId ||
      "";

    const newThumbnailPublicId =
      newData.thumbnailPublicId ||
      "";

    const thumbnailChanged =
      oldThumbnailPublicId &&
      oldThumbnailPublicId !==
        newThumbnailPublicId;

    const oldImagePublicIds:
      string[] =
      existingProject.imagePublicIds ||
      [];

    const newImagePublicIds:
      string[] =
      newData.imagePublicIds ||
      [];

    const removedGalleryPublicIds =
      oldImagePublicIds.filter(
        (publicId) =>
          publicId &&
          !newImagePublicIds.includes(
            publicId
          )
      );

    const project =
      await Project.findByIdAndUpdate(
        id,
        newData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      thumbnailChanged
    ) {
      await deleteCloudinaryImage(
        oldThumbnailPublicId
      );
    }

    for (const publicId of removedGalleryPublicIds) {
      await deleteCloudinaryImage(
        publicId
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error(
      "PUT project error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update project",
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
            "Invalid project ID",
        },
        {
          status: 400,
        }
      );
    }

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    const thumbnailPublicId =
      project.thumbnailPublicId ||
      "";

    const imagePublicIds:
      string[] =
      project.imagePublicIds ||
      [];

    await Project.findByIdAndDelete(
      id
    );

    if (
      thumbnailPublicId
    ) {
      await deleteCloudinaryImage(
        thumbnailPublicId
      );
    }

    for (const publicId of imagePublicIds) {
      await deleteCloudinaryImage(
        publicId
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Project deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE project error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete project",
      },
      {
        status: 500,
      }
    );
  }
}