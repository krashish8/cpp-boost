import math

class RunsTest:
    def __init__(self, data):
        """
        Runs Test, data is a string of 0 and 1
        """
        self.data = data

    def run(self):
        """
        Run the Runs Test
        """
        p_value = self._p_value()
        print("P-value (Runs Test):", p_value)
        if p_value < 0.01:
            print("FAILED Runs Test: The sequence is not random")
        else:
            print("PASSED Runs Test: The sequence is random")

    def _ones_proportion(self):
        """
        prop = number of '1' in data / length of data
        """
        return self.data.count('1') / len(self.data)

    def _v_n_obs(self):
        """
        sum of r(k) + 1, where r(k) = 0 if data[k] = data[k+1] are same,
        else 1
        """
        return 1 + sum(0 if self.data[k] == self.data[k+1]
                         else 1 for k in range(len(self.data) - 1))

    def _p_value(self):
        """
        p_value = erfc(abs(v_n_obs - 2*n*prop*(1-prop)) /
                    (2*sqrt(2*n)*prop*(1-prop)))
        """
        n = len(self.data)
        prop = self._ones_proportion()
        v_n_obs = self._v_n_obs()
        return math.erfc(abs(v_n_obs - 2*n*prop*(1-prop))
                / (2*math.sqrt(2*n)*prop*(1-prop)))

