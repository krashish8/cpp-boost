import math

class FrequencyTest:
    def __init__(self, data):
        """
        Frequency Test, data is a string of 0 and 1
        """
        self.data = data

    def run(self):
        """
        Run the frequency test
        """
        p_value = self._p_value()
        print("P-value (Frequency Test):", p_value)
        if p_value < 0.01:
            print("FAILED Frequency Test: The sequence is not random")
        else:
            print("PASSED Frequency Test: The sequence is random")


    def _s_n(self):
        """
        if char in data is '1', add 1, else add -1
        """
        return sum(1 if char == '1' else -1 for char in self.data)

    def _s_obs(self):
        """
        abs(s_n) / sqrt(n), where n is length of the data
        """
        s_n = self._s_n()
        return abs(s_n) / math.sqrt(len(self.data))

    def _p_value(self):
        """
        p_value = erfc(s_obs / sqrt(2))
        """
        s_obs = self._s_obs()
        return math.erfc(s_obs / math.sqrt(2))

