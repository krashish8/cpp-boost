class ExclusiveOrGenerator:
    def __init__(self, seed):
        """
        Exclusive OR generator
        """
        self.seed = seed
        self._check_seed()

    def next(self):
        """
        Get the next bit
        """
        l = len(self.seed)
        # xor of x[i-1] and x[i-127] is the next character
        c = str(int(self.seed[l-1]) ^ int(self.seed[l-127]))
        self.seed += c
        return int(c)

    def _check_seed(self):
        """
        Check that the seed is 127-bit string
        """
        if len(self.seed) != 127:
            raise ValueError("Seed must be of 127-bits")
        for i in self.seed:
            if i != '0' and i != '1':
                raise ValueError("Seed must be binary (0 or 1)")
