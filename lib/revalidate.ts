import { revalidatePath } from "next/cache";

export function revalidateHome() {
  try {
    revalidatePath("/");
  } catch (error) {
    console.warn("[revalidate] skipped:", error instanceof Error ? error.message : error);
  }
}

export function revalidateGallery() {
  try {
    revalidatePath("/gallery");
  } catch (error) {
    console.warn("[revalidate] skipped:", error instanceof Error ? error.message : error);
  }
}
