data = open('__data.csv', 'r').read();

ls = data.split("\n");

print('const organizations = {');

for line in ls:
	if '.png' in line:
		sp = line.split(',')

		# print(sp[1], ':' ,sp[2], ':', sp[4])
		print("\t", "'%s' : { 'name' : '%s', 'image' : '%s' }" % (sp[2] , sp[1] , sp[4]), ',')

print('};');