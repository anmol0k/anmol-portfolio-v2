import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getSession } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

type UploadPurpose =
  | "profile-image"
  | "project-image"
  | "achievement-image"
  | "testimonial-image"
  | "resume";

type UploadConfig = {
  folder: string;
  maxSize: number;
  allowedTypes: string[];
  resourceType: "image";
};

const uploadConfigs: Record<
  UploadPurpose,
  UploadConfig
> = {
  "profile-image": {
    folder:
      "anmol-portfolio/profile",
    maxSize:
      5 * 1024 * 1024,
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    resourceType: "image",
  },

  "testimonial-image": {
  folder:
    "anmol-portfolio/testimonials",
  maxSize:
    5 * 1024 * 1024,
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
  resourceType: "image",
},

  "project-image": {
    folder:
      "anmol-portfolio/projects",
    maxSize:
      8 * 1024 * 1024,
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    resourceType: "image",
  },

  "achievement-image": {
    folder:
      "anmol-portfolio/achievements",
    maxSize:
      8 * 1024 * 1024,
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    resourceType: "image",
  },

  resume: {
    folder:
      "anmol-portfolio/resume",
    maxSize:
      10 * 1024 * 1024,
    allowedTypes: [
      "application/pdf",
    ],
    resourceType: "image",
  },
};

function isUploadPurpose(
  value: string
): value is UploadPurpose {
  return Object.prototype.hasOwnProperty.call(
    uploadConfigs,
    value
  );
}

export async function POST(
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

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const rawPurpose =
      formData.get("purpose");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No file selected",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof rawPurpose !==
      "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Upload purpose is required",
        },
        {
          status: 400,
        }
      );
    }

    const purpose =
      rawPurpose.trim();

    if (
      !isUploadPurpose(
        purpose
      )
    ) {
      console.error(
        "Invalid upload purpose:",
        purpose
      );

      return NextResponse.json(
        {
          success: false,
          message: `Invalid upload purpose: ${purpose}`,
        },
        {
          status: 400,
        }
      );
    }

    const config =
      uploadConfigs[purpose];

    if (
      !config.allowedTypes.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            purpose === "resume"
              ? "Only PDF files are allowed for resume uploads"
              : "Only JPG, PNG and WebP images are allowed",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected file is empty",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      config.maxSize
    ) {
      const maxSizeMB =
        Math.round(
          config.maxSize /
            1024 /
            1024
        );

      return NextResponse.json(
        {
          success: false,
          message: `File size must be under ${maxSizeMB} MB`,
        },
        {
          status: 400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const result =
      await new Promise<{
        secure_url: string;
        public_id: string;
        resource_type: string;
        format?: string;
        bytes?: number;
      }>(
        (
          resolve,
          reject
        ) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  config.folder,

                resource_type:
                  config.resourceType,

                use_filename:
                  true,

                unique_filename:
                  true,

                overwrite:
                  false,
              },

              (
                error,
                result
              ) => {
                if (
                  error ||
                  !result
                ) {
                  reject(
                    error ||
                      new Error(
                        "Cloudinary upload failed"
                      )
                  );

                  return;
                }

                resolve({
                  secure_url:
                    result.secure_url,

                  public_id:
                    result.public_id,

                  resource_type:
                    result.resource_type,

                  format:
                    result.format,

                  bytes:
                    result.bytes,
                });
              }
            );

          uploadStream.end(
            buffer
          );
        }
      );

    return NextResponse.json({
      success: true,

      file: {
        url:
          result.secure_url,

        publicId:
          result.public_id,

        resourceType:
          result.resource_type,

        format:
          result.format || "",

        size:
          result.bytes ||
          file.size,

        purpose,
      },
    });
  } catch (error) {
    console.error(
      "Upload error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "File upload failed",
      },
      {
        status: 500,
      }
    );
  }
}