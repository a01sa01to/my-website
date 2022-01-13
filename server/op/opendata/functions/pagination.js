"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageInfoScheme = exports.PaginationFn = void 0;
const generateCursor = (data) => {
    const cursor = Buffer.from(JSON.stringify(data)).toString('base64');
    return cursor;
};
const applyCursorsToData = (allData, before, after) => {
    const data = allData.concat();
    if (after) {
        const afterData = JSON.parse(Buffer.from(after, 'base64').toString());
        const afterIndex = allData.findIndex((item) => JSON.stringify(item) === JSON.stringify(afterData));
        if (afterIndex > 0)
            data.splice(0, afterIndex + 1);
    }
    if (before) {
        const beforeData = JSON.parse(Buffer.from(before, 'base64').toString());
        const beforeIndex = allData.findIndex((item) => JSON.stringify(item) === JSON.stringify(beforeData));
        if (beforeIndex > 0)
            data.splice(beforeIndex);
    }
    return data;
};
const dataToReturn = (allData, before, after, first, last) => {
    const data = applyCursorsToData(allData, before, after);
    if (first) {
        if (first < 0)
            throw new Error('first must be greater than 0');
        if (data.length < first)
            throw new Error('first must be less than or equal to data.length');
        data.splice(first);
    }
    if (last) {
        if (last < 0)
            throw new Error('last must be greater than 0');
        if (data.length < last)
            throw new Error('last must be less than or equal to data.length');
        data.splice(0, data.length - last);
    }
    return data;
};
const hasPreviousPage = (allData, before, after, last) => {
    if (last) {
        let data = applyCursorsToData(allData, before, after);
        if (data.length > last)
            return true;
        else
            return false;
    }
    if (after)
        return true;
    return false;
};
const hasNextPage = (allData, before, after, first) => {
    console.log(first);
    if (first) {
        let data = applyCursorsToData(allData, before, after);
        if (data.length > first)
            return true;
        else
            return false;
    }
    if (before)
        return true;
    return false;
};
const PaginationFn = (allData, last_update, before, after, first, last) => {
    const data = dataToReturn(allData, before, after, first, last);
    const hasPrevious = hasPreviousPage(allData, before, after, last);
    const hasNext = hasNextPage(allData, before, after, first);
    const startCursor = generateCursor(data[0]);
    const endCursor = generateCursor(data[data.length - 1]);
    return {
        dataset: data,
        pageinfo: {
            hasPreviousPage: hasPrevious,
            hasNextPage: hasNext,
            startCursor,
            endCursor,
        },
        last_update,
    };
};
exports.PaginationFn = PaginationFn;
const PageInfoScheme = `
  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
    startCursor: String!
    endCursor: String!
  }
`;
exports.PageInfoScheme = PageInfoScheme;
