import { assert, expect } from 'chai';
import 'mocha';
import { DLVWrapper } from '@agile-visualizer-team/visualizer-asp/src/wrapper-dlv/dlv_wrapper'
var child_process = require('child_process')
var fs = require('fs')
var sinon = require('sinon')

//GIVEN a dlv wrapper
const dlvWrapper = new DLVWrapper()

describe('acceptance test',  () => {
    //Parametrizing tests
    it('returns the correct representation of an AS', () => {
        let dlv_executable_stub = sinon.stub(dlvWrapper, "run_dlv");
        dlv_executable_stub.returns("DLV X.X.X\n\n{m(2), s(2,3)}\nCOST 1@1\n")

        let console_stub = sinon.stub(console, 'log');

        //WHEN the user execute the program using the following parameters
        let argv = {
            dlv_path: 'dlv_path',
            asp_file: 'asp_file.asp',
        }

        let res = dlvWrapper.execute(argv);
        expect(res).to.be.equals(JSON.stringify([{ 'as': [ 'm(2)', 's(2,3)' ], 'cost': '1@1' }]));
        dlv_executable_stub.restore()
        console_stub.restore()
        
    });

    it('write to file the correct representation of an AS', () => {
        let dlv_executable_stub = sinon.stub(dlvWrapper, "run_dlv");
        dlv_executable_stub.returns("DLV X.X.X\n\n{m(2), s(2,3)}\nCOST 1@1\n")

        let file_stub = sinon.stub(fs, 'writeFile');

        //WHEN the user execute the program using the following parameters
        let argv = {
            dlv_path: 'dlv_path',
            asp_file: 'asp_file.asp',
            output: 'output.json'
        }

        dlvWrapper.execute(argv);
        expect(file_stub.calledOnce).to.be.true
        let test_res = file_stub.getCall(0).args.includes(JSON.stringify([{ 'as': [ 'm(2)', 's(2,3)' ], 'cost': '1@1' }]))
        expect(test_res).to.be.true
    });

})