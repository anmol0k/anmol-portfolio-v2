import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";
import { skillSchema } from "@/schemas/skillSchema";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const adminMode =
      searchParams.get("admin") === "true";

    if (adminMode) {
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
    }

    const filter = adminMode
      ? {}
      : { isActive: true };

    const skills = await Skill.find(filter)
      .sort({
        order: 1,
        createdAt: 1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      skills,
    });
  } catch (error) {
    console.error("GET skills error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch skills",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const skill = await Skill.create(validation.data);

    return NextResponse.json(
      {
        success: true,
        message: "Skill created successfully",
        skill,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST skill error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create skill",
      },
      {
        status: 500,
      }
    );
  }
}