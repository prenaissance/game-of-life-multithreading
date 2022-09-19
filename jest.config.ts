import { Config } from "jest";

const config: Config = {
    extensionsToTreatAsEsm: [".ts"],
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    globals: {
        "ts-jest": {
            useEsm: true,
            tsconfig: "tsconfig.json"
        }
    }
};

export default config;