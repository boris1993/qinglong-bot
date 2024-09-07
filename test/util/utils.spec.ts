import {extractEnvKeyAndValue} from '../../src/util/utils.js';
import {describe, it} from 'mocha';
import {assert, expect} from 'chai';

describe('utils tests', () => {
    it('should split the environment variable correctly', () => {
        const envString = 'key=value';
        const [envKey, envValue] = extractEnvKeyAndValue(envString);

        assert.equal(envKey, 'key');
        assert.equal(envValue, 'value');
    });

    it('should split the environment variable with Base64 value correctly', () => {
        const envString = 'key=KjxvYzlOJ19gZlRBUQ==';
        const [envKey, envValue] = extractEnvKeyAndValue(envString);

        expect(envKey).to.equal('key');
        expect(envValue).to.equal('KjxvYzlOJ19gZlRBUQ==');
    });
});
