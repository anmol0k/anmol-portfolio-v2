"use client";

import { useEffect, useState } from "react";

export type ProfileData = {
  _id?: string;
  name: string;
  title: string;
  shortBio: string;
  about: string;
  email: string;
  phone: string;
  resumeUrl: string;
  profileImage: string;
  availability: boolean;

  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
};

const emptyProfile: ProfileData = {
  name: "",
  title: "",
  shortBio: "",
  about: "",
  email: "",
  phone: "",
  resumeUrl: "",
  profileImage: "",
  availability: false,

  socialLinks: {
    github: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    whatsapp: "",
  },
};

export function useProfile() {
  const [profile, setProfile] =
    useState<ProfileData>(emptyProfile);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load profile"
          );
        }

        if (data.profile) {
          setProfile({
            ...emptyProfile,
            ...data.profile,

            socialLinks: {
              ...emptyProfile.socialLinks,
              ...(data.profile.socialLinks || {}),
            },
          });
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return {
    profile,
    loading,
  };
}