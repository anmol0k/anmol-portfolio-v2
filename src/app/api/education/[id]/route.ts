import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Education from "@/models/Education";
import { educationSchema } from "@/schemas/educationSchema";

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
          message: "Invalid education ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const validation = educationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid education data",
          errors: validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const education =
      await Education.findByIdAndUpdate(
        id,
        validation.data,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!education) {
      return NextResponse.json(
        {
          success: false,
          message: "Education not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Education updated successfully",
      education,
    });
  } catch (error) {
    console.error("PUT education error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update education",
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
          message: "Invalid education ID",
        },
        {
          status: 400,
        }
      );
    }

    const education =
      await Education.findByIdAndDelete(id);

    if (!education) {
      return NextResponse.json(
        {
          success: false,
          message: "Education not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error("DELETE education error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete education",
      },
      {
        status: 500,
      }
    );
  }
}