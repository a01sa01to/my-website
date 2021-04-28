const sleep = (s: number): Promise<void> => new Promise((r) => setTimeout(r, s))

export { sleep }
