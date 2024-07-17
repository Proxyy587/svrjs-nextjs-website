"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { modsSchema } from "@/lib/validations/validation";
import { useToast } from "@/components/ui/use-toast";

const SvrjsModsAdminPage = () => {
	const { toast } = useToast();
	const form = useForm<z.infer<typeof modsSchema>>({
		resolver: zodResolver(modsSchema),
		defaultValues: {
			fileName: "",
			version: "",
			downloadLink: "",
			fileSize: "",
		},
	});

	const onSubmit: SubmitHandler<z.infer<typeof modsSchema>> = async (data) => {
		const response = await fetch("/api/uploadmods", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (response.ok) {
			form.reset();
			toast({
				description: "Successfully Uploaded Mods",
			});
			console.log("Upload successful");
		} else {
			console.error("Upload failed");
			toast({
				description: "Upload failed",
				variant: "destructive",
			});
		}
	};

	return (
		<section id="mods-page" className="wrapper container">
			<h1 className="text-3xl font-bold py-6">Mods Form</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="fileName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>File Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="version"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Version</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="downloadLink"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Download Link</FormLabel>
								<UploadButton
									endpoint="imageUploader"
									onClientUploadComplete={(res) => {
										field.onChange(res[0].url);
									}}
									onUploadError={(error: Error) => {
										alert(`ERROR! ${error.message}`);
									}}
								/>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="fileSize"
						render={({ field }) => (
							<FormItem>
								<FormLabel>File Size</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="w-full text-lg rounded-full"
						size={"lg"}
					>
						Submit
					</Button>
				</form>
			</Form>
		</section>
	);
};

export default SvrjsModsAdminPage;
