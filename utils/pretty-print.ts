export function prettyPrint(...args: any[]) {
  console.log(args.map((arg) => JSON.stringify(arg, null, 2)).join('\n\n'))
}
