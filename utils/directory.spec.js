/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */

const should = require('should');
const Directory = require('./directory');

describe('Utils/Directory', function () {
  describe('#getDirectories()', function () {
    it('should get the top level directories of the root', () => {
      const path = require('path');
      /**
       * Get all top level directories of the given path
       *
       * @param  {String} srcpath  The src where to look for the directories
       * @return {Array}  List     of top level directories
       */
      const directories = Directory.getDirectories(path.resolve(__dirname, '..'));
      should(directories).containDeep(['commands', 'templates', 'utils']);
    });
  });


  describe('#getPathForComponent()', function () {
    it('should get the dirpath when dir passed', done => {
      Directory.getPathForComponent('./', (err, componentsFolder) => {
        should(componentsFolder).be.equal('./');
        done();
      });
    });

    it('should throw an error if not dir passed and no app|src folder', done => {
      Directory.getPathForComponent(null, err => {
        should(err).containDeep({ name: 'NotRootPathError' });
        done();
      });
    });

    describe('These generates dumb outputs:', function () {
      const fse = require('fs-extra');

      before(() => {
        fse.mkdirsSync('app/erwin/go');
      });

      it(`should throw an error if not dir passed, app|src folder exists but
          no components folder`, done => {
        Directory.getPathForComponent(null, err => {
          should(err).be.containDeep({ name: 'NotComponentsPathError' });
          done();
        });
      });

      it(`should generate a path if no dir passed but app|src and components
          folder exists`, done => {
        fse.mkdirsSync('app/erwin/go/components/tatata');
        Directory.getPathForComponent(null, (err, componentsFolder) => {
          should(componentsFolder).be.equal('app/erwin/go/components');
          done();
        });
      });

      after(() => {
        fse.removeSync('app');
      });
    });
  });
});
