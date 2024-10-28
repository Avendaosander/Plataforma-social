import nodemailer from "nodemailer"

interface EmailOptions {
	to: string
	subject: string
	text?: string
	link?: string
	html?: string
}

interface HtmlBuild {
	text: string
	link: string
}

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASSWORD
	}
})

const buildHtml = ({ text, link }: HtmlBuild) => {
	return `
      <body style="font-family: Barlow, sans-serif; color: #333;">
        <div style="text-align: center; padding: 20px;">
          <h1 style="color: #09262a;">${text}</h1>
            <p>
              Pulsa <a href="${link}" style="color: #88c426; text-decoration: none;" target="_blank" rel="noopener noreferrer">aquí</a> para ir a la plataforma.
            </p>
        </div>
      </body>
    `
}

export const sendEmailService = async ({
	to,
	subject,
	text,
	link
}: EmailOptions): Promise<void> => {
	const html = buildHtml({ text, link })
	const mailOptions = {
		from: process.env.GMAIL_USER,
		to,
		subject,
		text,
		html
	}

	try {
		await transporter.sendMail(mailOptions)
		console.log(`Correo enviado a ${to}`)
	} catch (error) {
		console.error("Error al enviar el correo:", error)
		throw new Error("No se pudo enviar el correo")
	}
}
