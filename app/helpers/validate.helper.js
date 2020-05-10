import validator from 'validator';

import globalHelper from '../helpers/global.helper';

const {camelCaseToStr} = globalHelper;

class validate {
    constructor(body, rules, messages) {
        this.error = {};
        this.body = body;
        this.rules = rules;
        this.messages = messages;
        if (this.rules == undefined) {
            this.rules = {};
        }
        if (this.messages == undefined) {
            this.messages = {};
        }
    }

    /**
     * set rules
     *
     * @param rules
     */
    setRules = (rules) => {
        this.rules = rules;
    };

    /**
     * get errors
     *
     * @returns {{}}
     */
    errors = () => {
        return this.error;
    };

    /**
     * get first error
     *
     * @returns {{}}
     */
    errorStr = () => {
        for (let key in this.error) {
            let errors = this.error[key];
            for (let index in errors) {
                return errors[index];
            }
        }
        return true;
    };

    /**
     * get all rules for each fields
     *
     * @returns {boolean}
     */
    check = () => {
        for (let key in this.rules) {
            let rules = this.rules[key].split("|");
            for (let index in rules) {
                let rule = rules[index];
                this[rule](key);
            }
        }
        let keys = Object.keys(this.error);
        if (keys.length > 0) {
            return false;
        }
        return true;
    };

    /**
     * run validation
     *
     * @returns {boolean}
     */
    run = () => {
        if (this.check() === false) {
            return false;
        }
        return true;
    };

    /**
     * get messages
     *
     * @param key
     * @param message
     * @returns {*}
     */
    getMessage = (key, message) => {
        if (this.messages && this.messages[key] != undefined) {
            return this.messages[key];
        }
        return message;
    };

    /**
     * required validation
     * @param key
     */
    required = (key) => {
        let field = this.body[key];
        if (field === undefined || field === "") {
            if (this.error[key] == undefined) {
                this.error[key] = [];
            }
            this.error[key].push(
                this.getMessage(key + ".required", `${camelCaseToStr(key)} field is required.`)
            );
        }
    };

    /**
     * Email validation
     *
     * @param key
     */
    email = (key) => {
        let field = this.body[key];
        if (field && !validator.isEmail(field)) {
            if (this.error[key] == undefined) {
                this.error[key] = [];
            }
            this.error[key].push(
                this.getMessage(key + ".email", "Invalid email address.")
            );
        }
    };

    /**
     * Number validation
     *
     * @param key
     */
    number = (key) => {
        let field = this.body[key];
        try {
            if (!(typeof field == "number") || field < 0) {
                if (this.error[key] == undefined) {
                    this.error[key] = [];
                }
                this.error[key].push(
                    this.getMessage(key + ".number", `${camelCaseToStr(key)} field must be Number`)
                );
            }
        } catch (err) {
            if (this.error[key] == undefined) {
                this.error[key] = [];
            }
            this.error[key].push(
                this.getMessage(key + ".number", `${camelCaseToStr(key)} field must be Number`)
            );
        }
    };

    /**
     * Latitude validation
     *
     * @param key
     */
    latitude = (key) => {
        let field = this.body[key];
        if (
            field &&
            (!validator.isNumeric(field) || field < -90 || field > 90)
        ) {
            if (this.error[key] == undefined) {
                this.error[key] = [];
            }
            this.error[key].push(
                this.getMessage(
                    key + ".latitude",
                    "latitude must be between -90 and 90."
                )
            );
        }
    };

    /**
     * Longitude validation
     *
     * @param key
     */
    longitude = (key) => {
        let field = this.body[key];
        if (
            field &&
            (!validator.isNumeric(field) || field < -180 || field > 180)
        ) {
            if (this.error[key] == undefined) {
                this.error[key] = [];
            }
            this.error[key].push(
                this.getMessage(
                    key + ".longitude",
                    "longitude must be between -180 and 180."
                )
            );
        }
    };

    /**
     * Url validation
     *
     * @param key
     */
    url = (key) => {
        let field = this.body[key];
        if (field && !validator.isURL(field)) {
            if (this.error[key] == undefined) {
                this.error[key] = [];
            }
            this.error[key].push(
                this.getMessage(key + ".url", `${camelCaseToStr(key)} field has invalid URL address.`)
            );
        }
    };

    /**
     * Boolean validation
     *
     * @param key
     */
    boolean = (key) => {
        let field = this.body[key];
        if (field == 'true') {
            field = true;
        } else if (field == 'false') {
            field = false;
        }
        try {
            if (!(typeof field == "boolean")) {
                if (this.error[key] == undefined) {
                    this.error[key] = [];
                }
                this.error[key].push(
                    this.getMessage(key + ".boolean", `${camelCaseToStr(key)} field must be Boolean`)
                );
            }
        } catch (err) {
            if (this.error[key] == undefined) {
                this.error[key] = [];
            }
            this.error[key].push(
                this.getMessage(key + ".boolean", `${camelCaseToStr(key)} field must be Boolean`)
            );
        }
    };

    /**
     * array validation
     *
     * @param key
     */
    array = (key) => {
        let field = this.body[key];
        if (field === undefined || !Array.isArray(field)) {
            if (this.error[key] == undefined) {
                this.error[key] = [];
            }
            this.error[key].push(
                this.getMessage(key + ".array", `${camelCaseToStr(key)} field should be array.`)
            );
        }
    };

    /**
     * array  validation
     *
     * @param key
     */
    shouldHaveElements = (key) => {
        let field = this.body[key];
        if (field === undefined || !Array.isArray(field) || !field.length > 0) {
            if (this.error[key] == undefined) {
                this.error[key] = [];
            }
            this.error[key].push(
                this.getMessage(
                    key + ".shouldHaveElements",
                    `${camelCaseToStr(key)} field should have some elements.`
                )
            );
        }
    };
}

export default validate;