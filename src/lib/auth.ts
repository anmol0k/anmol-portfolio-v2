import {
  SignJWT,
  jwtVerify,
} from "jose";

import {
  cookies,
} from "next/headers";

const SESSION_COOKIE =
  "admin_session";

const SESSION_ISSUER =
  "anmol-portfolio";

const SESSION_AUDIENCE =
  "anmol-portfolio-admin";

function getSecret() {
  const secret =
    process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "Please define AUTH_SECRET in .env.local"
    );
  }

  return new TextEncoder().encode(
    secret
  );
}

export type SessionPayload = {
  userId: string;
  email: string;
  role: "admin";
};

export async function createSession(
  payload: SessionPayload
) {
  const token =
    await new SignJWT({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setIssuer(
        SESSION_ISSUER
      )
      .setAudience(
        SESSION_AUDIENCE
      )
      .setExpirationTime("7d")
      .sign(getSecret());

  const cookieStore =
    await cookies();

  cookieStore.set(
    SESSION_COOKIE,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "lax",
      path: "/",

      maxAge:
        60 * 60 * 24 * 7,
    }
  );
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore =
      await cookies();

    const token =
      cookieStore.get(
        SESSION_COOKIE
      )?.value;

    if (!token) {
      return null;
    }

    const { payload } =
      await jwtVerify(
        token,
        getSecret(),
        {
          issuer:
            SESSION_ISSUER,

          audience:
            SESSION_AUDIENCE,
        }
      );

    if (
      typeof payload.userId !==
        "string" ||
      typeof payload.email !==
        "string" ||
      payload.role !== "admin"
    ) {
      return null;
    }

    return {
      userId:
        payload.userId,

      email:
        payload.email,

      role: "admin",
    };
  } catch (error) {
    console.error(
      "Session verification error:",
      error
    );

    return null;
  }
}

export async function deleteSession() {
  const cookieStore =
    await cookies();

  cookieStore.set(
    SESSION_COOKIE,
    "",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }
  );
}