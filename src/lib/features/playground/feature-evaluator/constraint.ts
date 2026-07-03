import {
    gt as semverGt,
    lt as semverLt,
    eq as semverEq,
    gte as semverGte,
    lte as semverLte,
} from 'semver';
import type { Context } from './context.js';
import { resolveContextValue } from './helpers.js';
import { RE2JS } from 're2js';

export interface Constraint {
    contextName: string;
    operator: Operator;
    inverted: boolean;
    values: string[];
    value?: string | number | Date;
    caseInsensitive?: boolean;
}

export enum Operator {
    IN = 'IN',
    NOT_IN = 'NOT_IN',
    STR_ENDS_WITH = 'STR_ENDS_WITH',
    STR_STARTS_WITH = 'STR_STARTS_WITH',
    STR_CONTAINS = 'STR_CONTAINS',
    NUM_EQ = 'NUM_EQ',
    NUM_GT = 'NUM_GT',
    NUM_GTE = 'NUM_GTE',
    NUM_LT = 'NUM_LT',
    NUM_LTE = 'NUM_LTE',
    DATE_AFTER = 'DATE_AFTER',
    DATE_BEFORE = 'DATE_BEFORE',
    SEMVER_EQ = 'SEMVER_EQ',
    SEMVER_GT = 'SEMVER_GT',
    SEMVER_LT = 'SEMVER_LT',
    SEMVER_GTE = 'SEMVER_GTE',
    SEMVER_LTE = 'SEMVER_LTE',
    REGEX = 'REGEX',
}

export type OperatorImpl = (
    constraint: Constraint,
    context: Context,
) => boolean;

const cleanValues = (values: string[]) =>
    values.filter((v) => { throw new Error("STUB"); }).map((v) => { throw new Error("STUB"); });

const InOperator = (constraint: Constraint, context: Context) => {
    throw new Error("STUB");
};

const StringOperator = (constraint: Constraint, context: Context) => {
    throw new Error("STUB");
};

const SemverOperator = (constraint: Constraint, context: Context) => {
    throw new Error("STUB");
};

const DateOperator = (constraint: Constraint, context: Context) => {
    throw new Error("STUB");
};

const NumberOperator = (constraint: Constraint, context: Context) => {
    throw new Error("STUB");
};

const RegexOperator = (constraint: Constraint, context: Context) => {
    throw new Error("STUB");
};

export const operators = new Map<Operator, OperatorImpl>();
operators.set(Operator.IN, InOperator);
operators.set(Operator.NOT_IN, InOperator);
operators.set(Operator.STR_STARTS_WITH, StringOperator);
operators.set(Operator.STR_ENDS_WITH, StringOperator);
operators.set(Operator.STR_CONTAINS, StringOperator);
operators.set(Operator.NUM_EQ, NumberOperator);
operators.set(Operator.NUM_LT, NumberOperator);
operators.set(Operator.NUM_LTE, NumberOperator);
operators.set(Operator.NUM_GT, NumberOperator);
operators.set(Operator.NUM_GTE, NumberOperator);
operators.set(Operator.DATE_AFTER, DateOperator);
operators.set(Operator.DATE_BEFORE, DateOperator);
operators.set(Operator.SEMVER_EQ, SemverOperator);
operators.set(Operator.SEMVER_GT, SemverOperator);
operators.set(Operator.SEMVER_LT, SemverOperator);
operators.set(Operator.SEMVER_GTE, SemverOperator);
operators.set(Operator.SEMVER_LTE, SemverOperator);
operators.set(Operator.REGEX, RegexOperator);
