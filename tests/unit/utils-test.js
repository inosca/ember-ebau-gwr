import { stripLeadingZero, applyTransforms } from "ember-ebau-gwr/utils";
import { module, test } from "qunit";

module("Unit | Utility | utils", function () {
  test("stripLeadingZero", function (assert) {
    const values = [
      "0995-2019/03",
      "00995-2019/03",
      "0 995-2019/03",
      "00 995-2019/03",
      "995-2019/03",
      " 995-2019/03",
      "  995-2019/03",
      " 0995-2019/03",
      " 0 995-2019/03",
      "2021-1",
      "22021-1",
    ];
    const expected = [
      "995-2019/03",
      "995-2019/03",
      "995-2019/03",
      "995-2019/03",
      "995-2019/03",
      "995-2019/03",
      "995-2019/03",
      "995-2019/03",
      "995-2019/03",
      "2021-1",
      "22021-1",
    ];
    assert.deepEqual(values.map(stripLeadingZero), expected);
  });

  test("applyTransforms", function (assert) {
    const object = { test: "hey" };
    const map = {
      test: (value) => {
        assert.strictEqual(value, object.test);
        return "hello";
      },
    };

    assert.deepEqual(applyTransforms(object, map), { test: "hello" });
  });
});
