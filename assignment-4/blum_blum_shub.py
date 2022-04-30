class BlumBlumShubGenerator:
    def __init__(self, p, q, seed):
        """
        Blum Blum Shub generator
        Takes p and q (prime numbers) and seed (integer) as an input
        The prime numbers must leave remainder 3 when divided by 4
        """
        self.p = p
        self.q = q
        self.n = p * q
        self.seed = seed
        self._check_seed()
        self.x = (self.seed * self.seed) % self.n

    def next(self):
        """
        Get the next bit
        """
        self.x = (self.x * self.x) % self.n
        return self.x % 2

    def _check_seed(self):
        """
        Check whether the seed is valid (relatively prime to n)
        and in the proper range
        """
        if self.seed < 0 or self.seed > self.n:
            raise ValueError("Seed must be in range [0, n]")
        if self._gcd(self.seed, self.n) != 1:
            raise ValueError("Seed must be relatively prime to n")

    def _gcd(self, a, b):
        """
        Euclidean algorithm to find the greatest common divisor
        """
        while b != 0:
            a, b = b, a % b
        return a
