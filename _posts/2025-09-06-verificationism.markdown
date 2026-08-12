---
layout: post
title:  "The Verification Principle for Tests"
date:   2025-09-05 00:00:00 +0000
categories: testing
---

# The Verification Principle for Tests

Somewhere in your codebase there is a test that has never failed and never will. It configures a mock to return `42`, calls the mock, and asserts that it got back `42`. It is green. It is worthless. And a philosophical argument from 1936 explains exactly why.

The argument is [verificationism](https://en.wikipedia.org/wiki/Verificationism), and it hands us a surprisingly sharp tool for separating tests that protect us from tests that merely decorate the coverage report.

Here is the whole idea in one line, the version worth stealing:

> **A test is meaningful only if it could fail for a reason that tells you something about the system.**

Call it the *verification principle for tests*. Everything below is an unpacking of that sentence and, more importantly, how to act on it before your next commit.

## The philosophy, compressed

In [Language, Truth, and Logic](https://en.wikipedia.org/wiki/Language,_Truth_and_Logic), A.J. Ayer argued that a statement is meaningful only if it is one of two things: a [tautology](https://en.wikipedia.org/wiki/Tautology_(logic)) (true purely by definition or logical form), or [empirically verifiable](https://en.wikipedia.org/wiki/Empirical_evidence) (confirmable or refutable by observation). Anything else — untethered from both logic and evidence — he dismissed as literally meaningless.

He drew the line as [analytic vs. synthetic](https://en.wikipedia.org/wiki/Analytic–synthetic_distinction):

- **Analytic** statements ("all bachelors are unmarried") are true by definition. They tell you nothing about the world.
- **Synthetic** statements ("the server responds in under 200ms") assert something about the world, and the world gets a vote on whether they are true.

Now swap "the world" for "the system under test." An analytic test is one that is true by construction — it cannot lose. A synthetic test is one the running code could refute. Only the second kind carries information.

This is the software cousin of [Popper's falsifiability](https://en.wikipedia.org/wiki/Falsifiability): a claim that nothing could ever refute is not a strong claim, it is an empty one. **A test that cannot fail is the unfalsifiable claim of software engineering.**

## The disease: tautological tests

Once you have the principle, you start seeing tautological tests everywhere. They come in three grades of subtlety.

### Grade 1: the obvious tautology

```typescript
test("math", () => {
  expect(2 + 2).toBe(4);
});
```

This tests the language's arithmetic, not your system. Harmless, pointless, and rarely written on purpose.

### Grade 2: the disguised tautology

This is the one that hurts, because it looks like a real test and passes code review.

```typescript
// BAD: the mock is the thing being "verified"
test("getUser returns a user", () => {
  const repo = { getUser: jest.fn().mockReturnValue({ id: 1, name: "Ada" }) };

  const result = repo.getUser(1);

  expect(result.name).toBe("Ada"); // you asserted your own setup
});
```

Nothing here touches the real repository. You told the mock what to return and then confirmed it returned it. Delete the system entirely and the test still passes. By the verification principle, it is meaningless: no bug in your code could ever make it fail.

### Grade 3: the assertion that restates the implementation

```typescript
// BAD: the test encodes the same logic it claims to check
const discount = (price: number, rate: number) => price * (1 - rate);

test("discount", () => {
  expect(discount(100, 0.2)).toBe(100 * (1 - 0.2)); // tautology in disguise
});
```

The right-hand side is the implementation copied into the test. If the formula is wrong, the test is wrong in the same way, and it still passes. You have proven that `x == x`.

## The cure: synthetic tests

The fix in every case is the same. Make the assertion something the system could genuinely violate, and pin it to an *independently known* expected value.

```typescript
// GOOD: independent oracle, real behavior
test("discount applies the percentage off", () => {
  // 20% off £100 is a fact about the world, computed by a human, not the code
  expect(discount(100, 0.2)).toBe(80);
  expect(discount(50, 0.5)).toBe(25);
  expect(discount(100, 0)).toBe(100); // boundary: no discount
});
```

The expected values come from outside the implementation. If someone "optimizes" `discount` into `price * rate`, these tests go red immediately. That redness is information — exactly what the tautological version could never give you.

For the mock example, the cure is to test the real collaborator, or at minimum test the logic that sits *around* the collaborator rather than the collaborator's canned answer:

```typescript
// GOOD: exercise real behavior against a real (or in-memory) store
test("getUser reads back what was written", () => {
  const repo = new InMemoryUserRepository();
  repo.save({ id: 1, name: "Ada" });

  const result = repo.getUser(1);

  expect(result.name).toBe("Ada"); // only passes if save + getUser actually work
});
```

Now a bug in `save` or `getUser` breaks the test. The world gets a vote.

> Before writing any assertion, ask: *could this be false if the system were broken?* If the answer is no, delete it.

## Strong vs. weak verification, and why you should stop chasing proof

Ayer knew that conclusively verifying an empirical claim under *all* conditions is almost never possible, so he distinguished **strong** verification (conclusive proof) from **weak** verification (evidence that makes a claim probable).

Testing lives entirely in the weak column, and that is fine. You will never prove your system correct with examples; complexity and infinite input spaces see to that. What you can do is maximize the *evidence* each test provides. That reframes the goal:

> Don't ask "does this test prove the code works?" Ask "how much would a failure of this test tell me?"

[Property-based testing](https://en.wikipedia.org/wiki/Property_testing) is weak verification taken seriously — instead of one hand-picked example, you assert an invariant across hundreds of generated inputs:

```typescript
import fc from "fast-check";

test("discount never exceeds the price", () => {
  fc.assert(
    fc.property(
      fc.double({ min: 0, max: 1e6 }),
      fc.double({ min: 0, max: 1 }),
      (price, rate) => {
        const result = discount(price, rate);
        return result >= 0 && result <= price;
      },
    ),
  );
});
```

No single run proves the invariant. Together they are strong evidence, and any counterexample is a genuine, information-rich failure.

## Verifiable in principle isn't good enough

Ayer drew one more line: between statements verifiable *in practice* and those verifiable only *in principle* — decidable in theory, but beyond anyone's reach to actually check. Tests have the same split, and it is where good intentions quietly die.

A test that is `test.skip`-ped "temporarily," hidden behind a feature flag that never flips in CI, quarantined for being flaky, or sitting in a suite nobody runs is verifiable only in principle. It *could* fail — but nothing ever gives it the chance. Empirically, it protects you exactly as much as no test at all.

> A test that can only fail in principle — never triggered in CI — is not protecting you. Run it or delete it.

## Test oracles: where meaning actually lives

A [test oracle](https://en.wikipedia.org/wiki/Test_oracle) is whatever decides pass or fail. The verification principle is really a statement about oracles:

- An oracle built on a logical truth or on the implementation itself always passes. It emits zero bits.
- A useful oracle is grounded in something **observable and independent**: a hand-computed value, a specification, a known-good reference implementation, a prior recorded output, a user-visible effect.

When a test feels weak, the problem is almost always the oracle. Ask where the expected value comes from. If the answer is "from the code under test," you have a tautology.

## The checklist: apply this before your next commit

Run each new test through these questions. If any answer is wrong, the test is decoration.

1. **Could this test fail?** If no bug you can imagine would turn it red, delete it.
2. **Where does the expected value come from?** If it comes from the implementation, replace it with an independent oracle.
3. **Am I asserting my own setup?** If the mock supplies the answer the assertion checks, you are testing the mock.
4. **What does a failure tell me?** Prefer tests whose failure points at a specific, real defect over tests that fail vaguely or never.
5. **Is this empirical or analytic?** Analytic facts (`2 + 2 == 4`, framework behavior) belong to someone else's test suite, not yours.
6. **Am I chasing proof?** Accept evidence. Spend the effort on invariants and boundaries, not on impossible certainty.
7. **Does it actually run?** A skipped, flag-gated, or quarantined test that never executes in CI protects you as much as no test at all.

## The green useless test, revisited

Go back to the test from the first paragraph — the mock that returns `42` and asserts it got `42`. Now you can name its disease precisely: it is analytic, not synthetic. It is true by construction, unfalsifiable, an oracle grounded in nothing but its own setup. It is the software equivalent of "all bachelors are unmarried": impeccably true, and completely uninformative.

Ayer's test for a meaningful statement turns out to be a rather good test for a meaningful test:

> If nothing in the world — or in your system — could ever prove it wrong, it was never really saying anything at all.
