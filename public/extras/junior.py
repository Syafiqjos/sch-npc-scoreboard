import requests
from pandas import json_normalize
import json


def make_json(school_id, school_name, df_ready):
    if school_id in df_ready['school_id'].values:
        return [school_id, school_name, (df_ready['img_url'].loc[df_ready['school_id'] == school_id]).item()]
    else:
        return [school_id, school_name, '']


if __name__ == '__main__':
    url_junior = "https://junior.schematics-npc.com/api/v2/users"
    resp_junior = requests.get(url=url_junior)

    df_junior = json_normalize(resp_junior.json())

    df_junior = json.loads(df_junior['data.objects'].to_json(orient='records'))
    df_junior = df_junior[0]

    df_junior = json_normalize(df_junior)
    df_junior = df_junior[['school_id', 'school_name']]
    df_junior = df_junior.drop_duplicates(subset=['school_id']).reset_index(drop=True)

    url_github = "https://api.github.com/repos/zydhanlinnar11/schematics-npc-online-judge/git/trees/main"
    resp_github = requests.get(url=url_github)

    df_github = json_normalize(resp_github.json())

    df_github = json.loads(df_github['tree'].to_json(orient='records'))
    df_github = df_github[0]
    df_github = json_normalize(df_github)

    url_pic = (df_github['url'].loc[df_github['path'] == 'logo-junior']).item()
    resp_pic = requests.get(url=url_pic)
    df_pic = json_normalize(resp_pic.json())

    df_pic = json.loads(df_pic['tree'].to_json(orient='records'))
    df_pic = df_pic[0]
    df_pic = json_normalize(df_pic)

    df_pic = df_pic[['path']]
    df_pic_url = df_pic

    df_pic_url['img_url'] = df_pic.apply(lambda
                                             row: "https://raw.githubusercontent.com/zydhanlinnar11/schematics-npc-online-judge/main/logo-junior/" + row.path,
                                         axis=1)
    df_pic_url['school_id'] = df_pic.apply(lambda row: int((row.path).split(".")[0]), axis=1)

    result = [make_json(x, y, df_pic_url) for x, y in zip(df_junior['school_id'], df_junior['school_name'])]

    data = {}
    for row in result:
        data[str(row[0])] = {'name': row[1], 'image': row[2]}

    with open('junior.json', 'w') as outfile:
        json.dump(data, outfile)
