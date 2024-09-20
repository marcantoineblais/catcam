export default function normaliseTime(value: number) {
    const valueStr = value.toFixed();
    return valueStr.length < 2 ? "0" + valueStr : valueStr;
}