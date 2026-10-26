import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** True only for accounts holding the admin role in user_roles. */
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        if (!cancelled) setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin");
      if (!cancelled) setIsAdmin(!!data && data.length > 0);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return isAdmin;
}
