import { mailtrapClient, sender } from "./mailtrap.config.js"

import { VERIFICATION_EMAIL_TEMPLATE , PASSWORD_RESET_SUCCESS_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE} from "./emailsTemplates.js"
import { response } from "express"

export const sendVerificationEmail = async (email, verificationToken) => {
    const reciplent = [{email}]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: reciplent,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category: "Email Verification"
        })

        console.log("Email sent successfully ",response)
    } catch (error) {
        console.error(`error sending verification `, error)

        throw new Error(`error sending verification email : ${error}`)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const reciplent = [{email}]

    try{

        await mailtrapClient.send({
            from: sender,
            to: reciplent,
            template_uuid: "721ded57-83f7-46ac-897e-4fc8a35bf670",
            template_variables: {
                company_info_name: "CodHub.ai",
                name: name,
            }
        });

        console.log("welecome email sent successfully ",response)
    } catch(error) {
        console.error(`error sending email: ${error}`)
    }
}


export const sendPasswordResetEmail = async (email, resetURL) => {
    const reciplent = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: reciplent,
            subject: 'Reset your password',
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category: "Password Reset"

        })


    } catch (error) {
        
    }
}


export const sendResetSuccessEmail = async(email) => {
    const reciplent = [{email}];

    try{

        const response = mailtrapClient.send({
            from: sender,
            to: reciplent,
            subject: "reste passwor successsfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        });

        console.log("passeord reset respons :: ", response)
    }catch(error){

        throw new Error(`Error sending password reset success email: ${error}`)
    }

}