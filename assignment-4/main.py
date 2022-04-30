from frequency_test import FrequencyTest
from runs_test import RunsTest

from exclusive_or import ExclusiveOrGenerator
from blum_blum_shub import BlumBlumShubGenerator


def num_to_127_bits(num):
    """
    Convert a number to a 127 bit binary string
    """
    return bin(num)[2:].zfill(127)[:127]



print("=========================")
print("BLUM BLUM SHUB GENERATOR")
print("=========================")


gen = BlumBlumShubGenerator(p=383, q=503, seed=101355)

rand = ''
for i in range(100):
    rand += str(gen.next())
print("Random stream of bits:", rand)


test = FrequencyTest(rand)
test.run()

test = RunsTest(rand)
test.run()



print("\n=========================")
print("EXCLUSIVE OR GENERATOR")
print("=========================")

gen = ExclusiveOrGenerator(
    num_to_127_bits(270817515257177748616637665753355960446)
)
rand = ''
for i in range(100):
    rand += str(gen.next())
print("Random stream of bits:", rand)


test = FrequencyTest(rand)
test.run()

test = RunsTest(rand)
test.run()
