export function getIn(state, name) {
    if (!state) {
        return state;
    }

    const path =
        typeof name === 'string'
            ? name
                  .replace(/\[/, '.')
                  .replace(/\]/, '')
                  .split('.')
            : '';
    const length = path.length;
    if (!length) {
        return undefined;
    }

    let result = state;
    for (let i = 0; i < length && !!result; ++i) {
        result = result[path[i]];
    }

    return result;
}

const setInWithPath = (state, value, path, pathIndex) => {
    if (pathIndex >= path.length) {
        return value;
    }

    const first = path[pathIndex];
    const next = setInWithPath(state && state[first], value, path, pathIndex + 1);

    if (!state) {
        const initialized = isNaN(first) ? {} : [];
        initialized[first] = next;
        return initialized;
    }

    if (Array.isArray(state)) {
        const copy = [].concat(state);
        copy[first] = next;
        return copy;
    }

    return Object.assign({}, state, {
        [first]: next,
    });
};

export function setIn(state, name, value) {
    return setInWithPath(
        state,
        value,
        typeof name === 'string'
            ? name
                  .replace(/\[/, '.')
                  .replace(/\]/, '')
                  .split('.')
            : '',
        0
    );
}

export function deleteIn(state, name) {
    if (!state) {
        return;
    }

    const path =
        typeof name === 'string'
            ? name
                  .replace(/\[/, '.')
                  .replace(/\]/, '')
                  .split('.')
            : '';
    const length = path.length;
    if (!length) {
        return state;
    }

    let result = state;
    for (let i = 0; i < length && !!result; ++i) {
        if (i === length - 1) {
            delete result[path[i]];
        } else {
            result = result[path[i]];
        }
    }

    return state;
}

export function getErrorStrs(errors, processErrorMessage) {
    if (errors) {
        return errors.map(e => {
            const message = typeof e.message !== 'undefined' ? e.message : e;

            if (typeof processErrorMessage === 'function') {
                return processErrorMessage(message);
            }

            return message;
        });
    }
    return errors;
}

export function getParams(ns, cb) {
    let names = typeof ns === 'string' ? [ns] : ns;
    let callback = cb;
    if (cb === undefined && typeof names === 'function') {
        callback = names;
        names = undefined;
    }
    return {
        names,
        callback,
    };
}

/**
 * 从组件事件中获取数据
 * @param e Event或者value
 * @returns value
 */
export function getValueFromEvent(e) {
    // support custom element
    if (!e || !e.target) {
        return e;
    }
    const { target } = e;

    if (target.type === 'checkbox') {
        return target.checked;
    } else if (target.type === 'radio') {
        //兼容原生radioGroup
        if (target.value) {
            return target.value;
        } else {
            return target.checked;
        }
    }
    return target.value;
}

function validateMap(rulesMap, rule, defaultTrigger) {
    const nrule = Object.assign({}, rule);

    if (!nrule.trigger) {
        nrule.trigger = [defaultTrigger];
    }

    if (typeof nrule.trigger === 'string') {
        nrule.trigger = [nrule.trigger];
    }

    for (let i = 0; i < nrule.trigger.length; i++) {
        const trigger = nrule.trigger[i];

        if (trigger in rulesMap) {
            rulesMap[trigger].push(nrule);
        } else {
            rulesMap[trigger] = [nrule];
        }
    }

    delete nrule.trigger;
}

/**
 * 提取rule里面的trigger并且做映射
 * @param  {Array} rules   规则
 * @param  {String} defaultTrigger 默认触发
 * @return {Object} {onChange:rule1, onBlur: rule2}
 */
export function mapValidateRules(rules, defaultTrigger) {
    const rulesMap = {};

    rules.forEach(rule => {
        validateMap(rulesMap, rule, defaultTrigger);
    });

    return rulesMap;
}

let warn = () => {};

// if (
//     typeof process !== 'undefined' &&
//     process.env &&
//     process.env.NODE_ENV !== 'production' &&
//     typeof window !== 'undefined' &&
//     typeof document !== 'undefined'
// ) {
//     warn = (...args) => {
//         /* eslint-disable no-console */
//         if (typeof console !== 'undefined' && console.error) {
//             console.error(...args);
//         }
//     };
// }

export const warning = warn;
