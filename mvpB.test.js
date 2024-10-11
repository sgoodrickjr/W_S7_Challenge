import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Sprint 7 Challenge Learner Tests', () => {
  /*
  👉 TASK 1 - Unit Testing of sum function at the bottom of this module

  Test the following. You can create separate tests or a single test with multiple assertions.

    [1] sum() // throws an error 'pass valid numbers'
    [2] sum(2, 'seven') // throws an error 'pass valid numbers'
    [3] sum(1, 3) // returns 4
    [4] sum('1', 2) // returns 3
    [5] sum('10', '3') // returns 13
  */
    describe('Unit Testing: sum function', () => {
      test('[1] sum() should throw an error when no arguments are provided', () => {
        expect(() => sum()).toThrow('pass valid numbers');
      });
    
      test('[2] sum(2, "seven") should throw an error when a non-numeric string is provided', () => {
        expect(() => sum(2, 'seven')).toThrow('pass valid numbers');
      });
    
      test('[3] sum(1, 3) should return 4', () => {
        expect(sum(1, 3)).toBe(4);
      });
    
      test('[4] sum("1", 2) should return 3', () => {
        expect(sum('1', 2)).toBe(3);
      });
    
      test('[5] sum("10", "3") should return 13', () => {
        expect(sum('10', '3')).toBe(13);
      });
    });
    
  
  /*
  👉 TASK 2 - Integration Testing of HelloWorld component at the bottom of this module

  Test the <HelloWorld /> component found below...
    - using `screen.queryByText` to capture nodes
    - using `toBeInTheDocument` to assert their existence in the DOM

    [1] renders a link that reads "Home"
    [2] renders a link that reads "About"
    [3] renders a link that reads "Blog"
    [4] renders a text that reads "The Truth"
    [5] renders a text that reads "JavaScript is pretty awesome"
    [6] renders a text that includes "javaScript is pretty" (use exact = false)
  */
  // test('you can comment out this test', () => {
  //   expect(true).toBe(false)
  // })

  describe('Integration Testing: HelloWorld Component', () => {
    test('[1] renders a link that reads "Home"', () => {
      render(<HelloWorld />);
      const homeLink = screen.queryByText('Home');
      expect(homeLink).toBeInTheDocument();
    });
  
    test('[2] renders a link that reads "About"', () => {
      render(<HelloWorld />);
      const aboutLink = screen.queryByText('About');
      expect(aboutLink).toBeInTheDocument();
    });
  
    test('[3] renders a link that reads "Blog"', () => {
      render(<HelloWorld />);
      const blogLink = screen.queryByText('Blog');
      expect(blogLink).toBeInTheDocument();
    });
  
    test('[4] renders a text that reads "The Truth"', () => {
      render(<HelloWorld />);
      const truthText = screen.queryByText('The Truth');
      expect(truthText).toBeInTheDocument();
    });
  
    test('[5] renders a text that reads "JavaScript is pretty awesome"', () => {
      render(<HelloWorld />);
      const jsAwesomeText = screen.queryByText('JavaScript is pretty awesome');
      expect(jsAwesomeText).toBeInTheDocument();
    });
  
    test('[6] renders a text that includes "javaScript is pretty" (case-insensitive, partial match)', () => {
      render(<HelloWorld />);
      const partialText = screen.queryByText(/javascript is pretty/i, { exact: false });
      expect(partialText).toBeInTheDocument();
    });
  });
})

function sum(a, b) {
  a = Number(a)
  b = Number(b)
  if (isNaN(a) || isNaN(b)) {
    throw new Error('pass valid numbers')
  }
  return a + b
}

function HelloWorld() {
  return (
    <div>
      <h1>Hello World Component</h1>
      <nav>
        <a href='#'>Home</a>
        <a href='#'>About</a>
        <a href='#'>Blog</a>
      </nav>
      <main>
        <section>
          <h2>The Truth</h2>
          <p>JavaScript is pretty awesome</p>
        </section>
      </main>
    </div>
  )
}

