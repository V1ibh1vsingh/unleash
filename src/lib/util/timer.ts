const NS_TO_S = 1e9;

// seconds takes a tuple of [seconds, nanoseconds]
// and returns the time in seconds
const seconds: (diff: [number, number]) => number = (diff) =>
    diff[0] + diff[1] / NS_TO_S;

const newTimer: () => () => number = () => {
    throw new Error("STUB");
};

const timer = {
    seconds,
    new: newTimer,
};

export default timer;
