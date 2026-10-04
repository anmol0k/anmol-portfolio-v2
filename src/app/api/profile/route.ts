import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getSession } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { profileSchema } from "@/schemas/profileSchema";

export async function GET() {
  try {
    await connectDB();

    const profile =
      await Profile.findOne().lean();

    return NextResponse.json({
      success: true,
      profile: profile || null,
    });
  } catch (error) {
    console.error(
      "GET profile error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch profile",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: NextRequest
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

    const body =
      await request.json();

    const validation =
      profileSchema.safeParse(
        body
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid profile data",
          errors:
            validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const existingProfile =
      await Profile.findOne();

    const newData =
      validation.data;

    let oldProfileImagePublicId =
      "";

    let oldResumePublicId =
      "";

    if (existingProfile) {
      const profileImageChanged =
        existingProfile.profileImagePublicId &&
        existingProfile.profileImagePublicId !==
          newData.profileImagePublicId;

      const resumeChanged =
        existingProfile.resumePublicId &&
        existingProfile.resumePublicId !==
          newData.resumePublicId;

      if (profileImageChanged) {
        oldProfileImagePublicId =
          existingProfile.profileImagePublicId;
      }

      if (resumeChanged) {
        oldResumePublicId =
          existingProfile.resumePublicId;
      }
    }

    let profile;

    if (existingProfile) {
      profile =
        await Profile.findByIdAndUpdate(
          existingProfile._id,
          newData,
          {
            new: true,
            runValidators: true,
          }
        );
    } else {
      profile =
        await Profile.create(
          newData
        );
    }

    if (
      oldProfileImagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          oldProfileImagePublicId,
          {
            resource_type:
              "image",
          }
        );
      } catch (error) {
        console.error(
          "Failed to delete old profile image:",
          error
        );
      }
    }

    if (oldResumePublicId) {
      try {
        await cloudinary.uploader.destroy(
          oldResumePublicId,
          {
            resource_type:
              "image",
          }
        );
      } catch (error) {
        console.error(
          "Failed to delete old resume:",
          error
        );
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error(
      "PUT profile error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update profile",
      },
      {
        status: 500,
      }
    );
  }
}