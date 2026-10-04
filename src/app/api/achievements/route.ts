import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Achievement from "@/models/Achievement";
import { achievementSchema } from "@/schemas/achievementSchema";

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

    const achievements = await Achievement.find(filter)
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      achievements,
    });
  } catch (error) {
    console.error("GET achievements error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch achievements",
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

    const validation =
      achievementSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid achievement data",
          errors: validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const achievement = await Achievement.create(
      validation.data
    );

    return NextResponse.json(
      {
        success: true,
        message: "Achievement created successfully",
        achievement,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST achievement error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create achievement",
      },
      {
        status: 500,
      }
    );
  }
}