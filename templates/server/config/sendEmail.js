import { Resend } from 'resend';

if(!process.env.RESEND_API) {
    throw new Error(
        "Please provide RESEND_API",
    )
}

const resend = new Resend(process.env.RESEND_API);

export default async function ({sendTo, subject, html}) {
    try {            
        const { data, error } = await resend.emails.send({
            from: 'Project Name <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });
        
        if (error) {
            return console.error({ error });
        }        
        return data;
    } catch (error) {
        console.log(error);
    }
}

