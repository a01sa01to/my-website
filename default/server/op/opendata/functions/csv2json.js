"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const str2date_1 = __importDefault(require("./str2date"));
const csv2json = (csv_content, overrides_map) => {
    csv_content = csv_content.replace(/\r\n/g, '\n');
    const csv_lines = csv_content.split('\n');
    const csv_headers = csv_lines[0].split(',');
    const csv_data = csv_lines.slice(1);
    const json_data = csv_data
        .filter((line) => {
        return line.split(',').length === csv_headers.length;
    })
        .map((line) => {
        const line_data = line.split(',');
        const json_line = {};
        line_data.forEach((data, i) => {
            const override_map = overrides_map[csv_headers[i]];
            if (!override_map) {
                throw new Error(`${csv_headers[i]} is not defined in overrides_map`);
            }
            if (override_map.type === 'number')
                json_line[override_map.header] = Number(data);
            else if (override_map.type === 'date')
                json_line[override_map.header] = (0, str2date_1.default)(data);
            else if (override_map.type === 'boolean') {
                const falsy = ['false', '0', 'null', 'undefined', '', 'NaN', '-0'];
                if (falsy.includes(data.toLowerCase()))
                    json_line[override_map.header] = false;
                else
                    json_line[override_map.header] = true;
            }
            else
                json_line[override_map.header] = data || null;
        });
        return json_line;
    });
    return JSON.stringify(json_data);
};
exports.default = csv2json;
