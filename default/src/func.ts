/**
 * 指定秒数待機
 * @param s 待機する秒数[ms]
 * @returns void
 */
const sleep = (s: number): Promise<void> => new Promise((r) => setTimeout(r, s))

export { sleep }
