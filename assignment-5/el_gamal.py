import random
import secrets


def pow(a, b, m):
    """
    Calculate a^b mod m, using the binary exponentiation algorithm
    """
    result = 1
    while b > 0:
        if b & 1:
            result = (result * a) % m
        b >>= 1
        a = (a * a) % m
    return result


def inverse(a, m):
    """
    Calculate the inverse of a mod m, when m is NOT prime,
    using the extended Euclidean algorithm
    """
    if gcd(a, m) != 1:
        raise ValueError("Inverse does not exist")
    u1, u2, u3 = 1, 0, a
    v1, v2, v3 = 0, 1, m
    while v3 != 0:
        q = u3 // v3
        v1, v2, v3, u1, u2, u3 = (
            u1 - q * v1), (u2 - q * v2), (u3 - q * v3), v1, v2, v3
    return u1 % m


def gcd(a, b):
    """
    Calculate the greatest common divisor of a and b,
    using Euclid's algorithm
    """
    while b:
        a, b = b, a % b
    return a


class ElGamal:
    def __init__(self, q, alpha):
        """
        ElGamal encryption algorithm
        """
        # q must be a prime number
        # alpha must be a primitive root of q
        self.q = q
        self.alpha = alpha

        # Private key = x
        # Public key = (y, alpha, q)
        self.x = random.randint(1, q-1)
        self.y = pow(alpha, self.x, q)

    def encrypt(self, m):
        """
        Anyone with the public key can encrypt a message
        """
        k = random.randint(1, self.q-1)
        key = pow(self.y, k, self.q)
        c1 = pow(self.alpha, k, self.q)

        c2_list = []
        # m is a string, we encrypt each character
        # after converting the character to int
        for i in m:
            m_int = ord(i)
            c2 = (key * m_int) % self.q
            c2_list.append(c2)
        return (c1, c2_list)

    def decrypt(self, c):
        """
        Anyone with the private key can decrypt a message
        """
        c1, c2_list = c
        key = pow(c1, self.x, self.q)

        m = ""
        # each character is decrypted and then concatenated to m
        for c2 in c2_list:
            m_char = (c2 * inverse(key, self.q)) % self.q
            m += chr(m_char)
        return m

    def sign(self, m):
        """
        Anyone with the private key can sign a message
        """
        k = random.randint(1, self.q-1)
        while gcd(k, self.q-1) != 1:
            k = random.randint(1, self.q-1)
        s1 = pow(self.alpha, k, self.q)

        s2_list = []
        for i in m:
            m_int = ord(i)
            s2 = (inverse(k, self.q-1) *
                 (m_int - self.x * s1)) % (self.q - 1)
            s2_list.append(s2)
        return (s1, s2_list)

    def verify(self, m, s):
        """
        Anyone with the public key can verify a signature
        """
        s1, s2_list = s

        v1_list = []
        for i in m:
            m_int = ord(i)
            v1 = pow(self.alpha, m_int, self.q)
            v1_list.append(v1)

        v2_list = []
        for s2 in s2_list:
            v2 = pow(self.y, s1, self.q) * pow(s1, s2, self.q) % self.q
            v2_list.append(v2)

        return v1_list == v2_list


# Creating the ElGamal object with prime number = 76403,
# and alpha = 4514, which is a primitive root of 76403
algo = ElGamal(q=76403, alpha=4514)

"""
===============================
Encryption and Decryption
===============================
"""

secret = "This is a secret message"

# e can be sent to the receiver
e = algo.encrypt(secret)

# The user decrypts the message
d = algo.decrypt(e)

print("\nEncrypted message:", e)
print("\nDecrypted message:", d)


"""
===============================
Signing and Verifying
===============================
"""

message = "This message will be signed"

# The user signs the message
signature = algo.sign(message)

# Verifying the message
verification = algo.verify(message, signature)

print("\nSignature:", signature)
print("\nVerification:", verification)
