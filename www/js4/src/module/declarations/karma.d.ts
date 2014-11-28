// Type definitions for karma-jasmine plugin
// Project: https://github.com/karma-runner/karma-jasmine
// Definitions by: Michel Salib <https://github.com/michelsalib>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="jasmine.d.ts" />

declare function describe(description: string, specDefinitions: () => void): void;
declare function it(expectation: string, assertion: () => void): void;

