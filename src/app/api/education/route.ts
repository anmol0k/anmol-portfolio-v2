import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Education from "@/models/Education";
import { educationSchema } from "@/schemas/educationSchema";

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

    const education = await Education.find(filter)
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      education,
    });
  } catch (error) {
    console.error("GET education error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch education",
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

    const education = await Education.create(
      validation.data
    );

    return NextResponse.json(
      {
        success: true,
        message: "Education created successfully",
        education,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST education error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create education",
      },
      {
        status: 500,
      }
    );
  }
}