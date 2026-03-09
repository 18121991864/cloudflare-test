import { create, all } from 'mathjs';
import { toNonExponential } from '@/filters/numberOperation';

const math = create(all, {
    number: 'BigNumber' // 识别 浮点数进行计算，但是作用有限，有些方法依然不受此配置影响
});
const { format, evaluate } = math;

export default function exprCalc(expr:string) {
    return toNonExponential(Number(format(evaluate(expr))));
}
