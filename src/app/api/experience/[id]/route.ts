import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { experienceSchema } from "@/schemas/experienceSchema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getSession();

    if (!session || session.role !== "admin") {
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

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid experience ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const validation = experienceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid experience data",
          errors: validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const experience =
      await Experience.findByIdAndUpdate(
        id,
        validation.data,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!experience) {
      return NextResponse.json(
        {
          success: false,
          message: "Experience not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    console.error("PUT experience error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update experience",
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
    const session = await getSession();

    if (!session || session.role !== "admin") {
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

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid experience ID",
        },
        {
          status: 400,
        }
      );
    }

    const experience =
      await Experience.findByIdAndDelete(id);

    if (!experience) {
      return NextResponse.json(
        {
          success: false,
          message: "Experience not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("DELETE experience error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete experience",
      },
      {
        status: 500,
      }
    );
  }
}