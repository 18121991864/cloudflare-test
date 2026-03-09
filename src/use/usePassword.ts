export interface IPasswordLevel {
    name: string; // 名称
    message: string; // 等级显示文案
    level: number;
    color: string;
}

// 计算字符串中每个字符的连续出现次数
function getConsecutiveCharCounts(str: string): { char: string; count: number }[] {
    const result: { char: string; count: number }[] = [];
    let currentChar = '', // 当前字符
        count = 0; // 当前字符的连续计数

    for (let i = 0; i < str.length; i++) {
        if (str[i] === currentChar) {
            // 如果当前字符与之前字符相同，增加计数
            count++;
        } else {
            // 如果当前字符与之前不同，保存之前字符信息并重置计数
            if (currentChar) {
                result.push({ char: currentChar, count });
            }
            currentChar = str[i];
            count = 1; // 重置计数
        }
    }

    // 保存最后一个字符的信息
    if (currentChar) {
        result.push({ char: currentChar, count });
    }
    return result;
}

// 判断字符串中是否存在另一个字符串中指定位数的子字符串
function hasSubstr(input: string, substr: string, count: number = 3): boolean {
    const keyboard = substr; // 正序
    const keyboardReverse = keyboard.split('').reverse().join(''); // 倒序

    // eslint-disable-next-line no-param-reassign
    input = input.toLowerCase();
    // 检测是否包含连续的子串
    const containsSequence = (layout: string) => {
        for (let i = 0; i <= input.length - count; i++) {
            const substring = input.substring(i, i + count);
            if (layout.includes(substring)) {
                return true;
            }
        }
        return false;
    };

    return containsSequence(keyboard) || containsSequence(keyboardReverse);
}

// 检查是否存在严格递增或递减的数字
function hasStrictlyConsecutiveNumbers(input: string, count: number = 3): boolean {
    return hasSubstr(input, '0123456789', count);
}

// 检查是否存在严格递增或递减的字母
function hasStrictlyConsecutiveLetters(input: string, count: number = 3): boolean {
    return hasSubstr(input, 'abcdefghijklmnopqrstuvwxyz', count);
}

// 检查是否存在严格递增或递减的键盘行
function hasStrictlyConsecutiveKeyboardOrder(input: string, count: number = 3): boolean {
    return hasSubstr(input, 'qwertyuiopasdfghjklzxcvbnm', count);
}

export function usePassword(_password: Ref<string | undefined>) {
    const levels = computed<IPasswordLevel[]>(() => {
        return [
            {
                name: 'weak',
                message: '弱',
                level: 1,
                color: '#DE4B4B',
            },
            {
                name: 'medium',
                message: '中',
                level: 2,
                color: '#FFCE22',
            },
            {
                name: 'strong',
                message: '强',
                level: 3,
                color: '#00BD8D',
            },
        ];
    });

    // 根据分数获取密码等级
    function getPaswordLevelByScore(score: number = 0) {
        const result = levels.value[0];
        if (score >= 80) {
            return levels.value[2];
        } else if (score >= 50) {
            return levels.value[1];
        }

        return Object.assign({}, result, { score });
    }

    // 弱密码数组
    const lpwd = 'password,admin,welcome,letmein,iloveyou,monkey,dragon'.split(',');

    // 验证密码等级
    function verifyPasswordLevel(password?: string) {
        if (!password) return getPaswordLevelByScore(0);
        let score = 0;

        // 2.1 密码长度评分
        if (password.length >= 8 && password.length < 12) {
            score += 10; // 8-12 字符
        } else if (password.length >= 12 && password.length <= 16) {
            score += 20; // 12-16 字符
        }

        // 2.2 字母评分
        const hasLowercase = /[a-z]/.test(password); // 是否包含小写字母
        const hasUppercase = /[A-Z]/.test(password); // 是否包含大写字母
        if (hasLowercase && hasUppercase) {
            score += 10; // 大小写混合字母
        }

        // 2.3 数字评分
        const digitCount = (password.match(/\d/g) || []).length; // 密码中的数字个数
        if (digitCount === 1) {
            score += 10; // 1 个数字
        } else if (digitCount > 1) {
            score += 20; // 大于 1 个数字
        }

        // 2.4 符号评分
        const symbolCount = (password.match(/[^a-zA-Z0-9\s\u4e00-\u9fa5]/g) || []).length; // 密码中的符号个数
        if (symbolCount === 1) {
            score += 10; // 1 个符号
        } else if (symbolCount > 1 && symbolCount <= 3) {
            score += 20; // 2-3 个符号
        } else if (symbolCount > 3) {
            score += 30; // 大于 3 个符号
        }

        // 2.5 奖励评分
        if (hasLowercase && hasUppercase && digitCount > 0 && symbolCount > 0) {
            score += 30; // 大小写字母、数字和符号
        } else if (hasLowercase && hasUppercase && digitCount > 0) {
            score += 10; // 大小写字母和数字
        }

        // 获取连续重复字符统计
        const counts = getConsecutiveCharCounts(password);

        // 连续3个以上重复字符：-20 分（如 aaa, BBB, 111）
        if (counts.some((item) => item.count > 2)) {
            score -= 20;
        }

        // 连续数字超过 3 个：-20 分（如 1234, 9876）（倒序同减）
        if (digitCount > 0 && hasStrictlyConsecutiveNumbers(password)) {
            score -= 20;
        }

        //  连续字母超过 3 个：-20 分（如 abc, XYZ）（倒序同减）
        if ((hasLowercase || hasUppercase) && hasStrictlyConsecutiveLetters(password)) {
            score -= 20;
        }

        // 弱模式（键盘顺序连续超过4位，如 qwer）（倒序同减）：-20 分
        if ((hasLowercase || hasUppercase) && hasStrictlyConsecutiveKeyboardOrder(password)) {
            score -= 20;
        }

        // 包含常见弱密码：（password、admin、welcome、letmein、iloveyou、monkey、dragon）：-30
        if (lpwd.includes(password.toLowerCase())) {
            score -= 30;
        }

        return getPaswordLevelByScore(score);
    }

    // 验证密码是否通过验证
    function verifyPassword(password?: string) {
        return [
            {
                key: 1,
                label: '8-16个字符',
                reg: /^.{8,16}$/,
            },
            {
                key: 2,
                label: '至少1个大写字母（A-Z）',
                reg: /[A-Z]/,
            },
            {
                key: 3,
                label: '至少1个小写字母（a-z）',
                reg: /[a-z]/,
            },
            {
                key: 4,
                label: '至少1个数字',
                reg: /\d/,
            },
        ].map((item) => {
            return {
                ...item,
                is: item.reg.test(password || ''),
            };
        });
    }

    //  获取密码验证结果
    const getVerifyResult = computed(() => verifyPassword(unref(_password)));

    // 获取密码验证等级
    const getPasswordLevel = computed(() => verifyPasswordLevel(unref(_password)));

    return {
        levels,
        verifyPasswordLevel,
        getVerifyResult,
        verifyPassword,
        getPasswordLevel,
    };
}
