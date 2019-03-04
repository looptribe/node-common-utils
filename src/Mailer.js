'use strict';

const nodemailer = require('nodemailer');
const path = require('path');
const Twig = require('twig');

class Mailer {
    /**
     * @param {object} config The configuration object.
     * @param {string} templatePath The path to the template folder.
     * @param {object} logger The winston logger.
     */
    constructor(config, templatePath, logger) {
        this._config = config;
        this._templatePath = templatePath;
        this._logger = logger;

        this._transport = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.username,
                pass: config.password,
            },
        });
    }

    /**
     * Renders a mail template.
     * @param {string} name Template name (without .twig extension).
     * @param {Object} params Template parameters.
     * @return {Promise<string>}
     */
    renderTemplate(name, params) {
        return new Promise((resolve, reject) => {
            Twig.renderFile(path.join(this._templatePath, `${name}.twig`), params, (err, output) => {
                if (err) {
                    return reject(err);
                }
                resolve(output);
            });
        });
    }

    /**
     * Sends a templated email to a user.
     * @param {Object} user User object.
     * @param {string} subject Email subject.
     * @param {string} templateName Template name (without .twig extension).
     * @param {Object} params Template parameters.
     * @return {Promise}
     */
    async sendEmailToUser(user, subject, templateName, params) {
        const html = await this.renderTemplate(templateName, params);
        const options = {
            from: this._config.from,
            to: user.email,
            subject,
            html,
        };
        this._logger.debug(`Sending email '${templateName}' to user ${user._id} <${user.email}>`);
        return new Promise((resolve, reject) => {
            this._transport.sendMail(options, (err, info) => {
                if (err) {
                    this._logger.warn(`Cannot send email '${templateName}' to user ${user._id} <${user.email}>`, err);
                    return reject(err);
                }
                this._logger.info(`Email '${templateName}' sent to user ${user._id} <${user.email}>: ${info.messageId}`);
                if (this._config.host === 'smtp.ethereal.email') {
                    this._logger.silly(`Ethereal account preview URL: ${nodemailer.getTestMessageUrl(info)}`);
                }
                resolve();
            });
        });
    }
}

module.exports = Mailer;
