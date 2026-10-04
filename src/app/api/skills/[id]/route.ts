import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";
import { skillSchema } from "@/schemas/skillSchema";

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
          message: "Invalid skill ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const validation = skillSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid skill data",
          errors: validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const skill = await Skill.findByIdAndUpdate(
      id,
      validation.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    console.error("PUT skill error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update skill",
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
          message: "Invalid skill ID",
        },
        {
          status: 400,
        }
      );
    }

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("DELETE skill error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete skill",
      },
      {
        status: 500,
      }
    );
  }
}