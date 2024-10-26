import {extractEnvKeyAndValue, extractCommandAndContent } from '../../src/util/utils.js';
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

    it('should extract the command and content correctly', () => {
        const text = "env list"
        const [command, content] = extractCommandAndContent(text)
        expect(command).to.equal('env list');
        expect(content).to.equal('');

        const text2 = "env add key=KjxvYzlOJ19gZlRBUQ=="
        const [command2, content2] = extractCommandAndContent(text2)
        expect(command2).to.equal('env add');
        expect(content2).to.equal('key=KjxvYzlOJ19gZlRBUQ==');

        const text3 = "env update key=value"
        const [command3, content3] = extractCommandAndContent(text3)
        expect(command3).to.equal('env update');
        expect(content3).to.equal('key=value');

        const text4 = "env delete 1,2,3,4,5"
        const [command4, content4] = extractCommandAndContent(text4)
        expect(command4).to.equal('env delete');
        expect(content4).to.equal('1,2,3,4,5');
    })
});
