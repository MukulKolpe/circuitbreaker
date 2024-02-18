// @ts-nocheck comment
import { useCallback, useEffect, useState } from "react";
import { Admin } from "../types";
import dynamic from "next/dynamic";
import { Admin } from "../types";
import * as bandadaAPI from "../pages/api/bandadaAPI";

function saveAdmin(admin: Admin) {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin", JSON.stringify(admin));
  }
}

function getAdmin() {
  let admin;
  if (typeof window !== "undefined") {
    admin = localStorage.getItem("admin");
  }

  if (admin) {
    return JSON.parse(admin);
  }

  return null;
}

function deleteAdmin() {
  localStorage.removeItem("admin");
}

export default function useSessionData() {
  const [_admin, setAdmin] = useState<Admin | null>(getAdmin());

  useEffect(() => {
    (async () => {
      if (!(await bandadaAPI.isLoggedIn())) {
        session.deleteAdmin();
        setAdmin(null);
      }
    })();
  }, []);

  const saveAdmin = useCallback((admin: Admin) => {
    saveAdmin(admin);
    setAdmin(admin);
  }, []);

  const deleteAdmin = useCallback(() => {
    deleteAdmin();
    setAdmin(null);
  }, []);

  return {
    saveAdmin,
    deleteAdmin,
    admin: _admin,
  };
}
