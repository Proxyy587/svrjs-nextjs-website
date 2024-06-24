import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
  imageUploader: f({ "application/zip": { maxFileSize: "8MB" } })
    // .middleware(async ({ req }) => {
    //   const user = await auth(req);
    //   if (!user) throw new UploadThingError("Unauthorized");
    //   return { userId: user.id };
    // })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      // return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;