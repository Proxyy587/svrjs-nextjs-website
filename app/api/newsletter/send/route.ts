import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import clientPromise from "@/lib/db";

const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email", //replace this also comment this if u not using etheral
	// service: "gmail", // uncomment if u using gmail
	port: 587,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASS,
	},
});

const sendEmail = async (to: string[], subject: string, html: string) => {
	try {
		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: to.join(", "),
			subject: subject,
			html: html,
		});
	} catch (error) {
		console.error("Error sending email:", error);
		throw new Error("Failed to send email");
	}
};

export async function POST(req: NextRequest) {
	try {
		const { subject, html } = await req.json();

		const client = await clientPromise;
		const db = client.db("newsletter");
		const collection = db.collection("subscribers");

		const subscribers = await collection
			.find({}, { projection: { email: 1 } })
			.toArray();

		if (subscribers.length === 0) {
			console.error("No subscribers found in the database.");
			return NextResponse.json(
				{ message: "No subscribers found." },
				{ status: 404 }
			);
		}

		const emails = subscribers.map((subscriber) => subscriber.email);

		if (emails.length === 0) {
			console.error("No email addresses found.");
			return NextResponse.json(
				{ message: "No email addresses found." },
				{ status: 404 }
			);
		}

		await sendEmail(emails, subject, html);
		return NextResponse.json({ message: "Emails sent successfully" });
	} catch (error) {
		console.error("Error handling POST request:", error);
		return NextResponse.error();
	}
}
