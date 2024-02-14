import { HttpException, Injectable } from '@nestjs/common';
import { CreateEditionDto } from './dto/create-edition.dto';
import { UpdateEditionDto } from './dto/update-edition.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateManyEditionsDto } from './dto/update-many.dto';
import { FileUploadService } from 'src/s3/s3.service';
import { getFilesS3 } from './helper/getFileS3';
import { Title } from '@prisma/client';
import { title } from 'process';
import { number } from 'zod';

@Injectable()
export class EditionsService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileUploadService,
  ) {}

  async create(createEditionDto: CreateEditionDto, file?: Express.Multer.File) {
    const editionAlreadyExists = await this.prisma.edition.findFirst({
      where: {
        name: createEditionDto.name,
      },
    });
    console.log(createEditionDto);

    if (editionAlreadyExists) {
      throw new HttpException('Edição já existe', 400);
    }

    const { image_key, image_url } = await getFilesS3(this.fileService, file);

    const titles = await this.prisma.baseTitle.findMany({
      where: {
        AND: [
          { name: { gte: createEditionDto.initial_title } },
          { name: { lte: createEditionDto.end_title } },
        ],
      },
    });

    const titlesAlreadyExists = await this.prisma.title.findMany({
      where: {
        name: {
          in: titles.map((title) => title.name),
        },
      },
    });

    let notExistsBaseTitle = [];

    if (createEditionDto.end_title && createEditionDto.initial_title) {
      notExistsBaseTitle = await this.prisma.baseTitle.findMany({
        where: {
          AND: [
            { name: { gte: createEditionDto.initial_title } },
            { name: { lte: createEditionDto.end_title } },
          ],
          NOT: {
            name: {
              in: titlesAlreadyExists?.map((title) => title?.name),
            },
          },
        },
      });
    }

    let notExistsBaseTitleDouble = [];
    let notExistsBaseTitleDoubleSecondChance = [];
    if (
      createEditionDto.initial_title_double_chance &&
      createEditionDto.end_title_double_chance
    ) {
      notExistsBaseTitleDouble = await this.prisma.baseTitle.findMany({
        where: {
          AND: [
            { name: { gte: createEditionDto.initial_title_double_chance } },
            { name: { lte: createEditionDto.end_title_double_chance } },
          ],
          NOT: {
            name: {
              in: titlesAlreadyExists?.map((title) => title?.name),
            },
          },
        },
      });

      const initialSecondRange = (Number(createEditionDto.initial_title_double_chance) + 100).toString()
      const endSecondRange = (Number(createEditionDto.end_title_double_chance) + 100).toString()
     

      notExistsBaseTitleDoubleSecondChance =
        await this.prisma.baseTitle.findMany({
          where: {
            AND: [
              {
                name: {
                  gte: `0000${initialSecondRange}`,
                },
              },
              {
                name: { lte: `0000${endSecondRange}` },
              },
            ],
            NOT: {
              name: {
                in: titlesAlreadyExists?.map((title) => title?.name),
              },
            },
          },
      });

      let mapDouble = new Map(notExistsBaseTitleDoubleSecondChance.map(title => [title.name, title]))
      console.log("mapDouble: ", mapDouble);
      
      notExistsBaseTitleDouble.forEach(title => {
        const titleNumber = (Number(title.name) + 100).toString()
        console.log("titleNumber; ", titleNumber);
        const titleDouble = mapDouble.get(`0000${titleNumber}`);
        console.log("titleDouble: ", titleDouble);
        if (titleDouble) {
          title.name_double = titleDouble.name
          title.dozens_double = titleDouble.dozens
          title.chances = 2
        }
      })
    }

    let notExistsBaseTitleTriple = [];
    let notExistsBaseTitleTripleSecond = [];
    let notExistsBaseTitleTripleThird = [];

    if (
      createEditionDto.end_title_triple_chance &&
      createEditionDto.initial_title_triple_chance
    ) {
      notExistsBaseTitleTriple = await this.prisma.baseTitle.findMany({
        where: {
          AND: [
            { name: { gte: createEditionDto.initial_title_triple_chance } },
            { name: { lte: createEditionDto.end_title_triple_chance } },
          ],
          NOT: {
            name: {
              in: titlesAlreadyExists?.map((title) => title?.name),
            },
          },
        },
      });

      const initialSecondRange = (Number(createEditionDto.initial_title_triple_chance) + 100).toString()
      const endSecondRange = (Number(createEditionDto.end_title_triple_chance) + 100).toString()
     

      notExistsBaseTitleTripleSecond =
        await this.prisma.baseTitle.findMany({
          where: {
            AND: [
              {
                name: {
                  gte: `0000${initialSecondRange}`,
                },
              },
              {
                name: { lte: `0000${endSecondRange}` },
              },
            ],
            NOT: {
              name: {
                in: titlesAlreadyExists?.map((title) => title?.name),
              },
            },
          },
      });
      
      const initialThirdRange = (Number(createEditionDto.initial_title_triple_chance) + 200).toString()
      const endThirdRange = (Number(createEditionDto.end_title_triple_chance) + 200).toString()
     

      notExistsBaseTitleTripleThird =
        await this.prisma.baseTitle.findMany({
          where: {
            AND: [
              {
                name: {
                  gte: `0000${initialThirdRange}`,
                },
              },
              {
                name: { lte: `0000${endThirdRange}` },
              },
            ],
            NOT: {
              name: {
                in: titlesAlreadyExists?.map((title) => title?.name),
              },
            },
          },
      });


      let mapTripleSecond = new Map(notExistsBaseTitleTripleSecond.map(title => [title.name, title]))
      let mapTripleThird = new Map(notExistsBaseTitleTripleThird.map(title => [title.name, title]))

      
      notExistsBaseTitleTriple.forEach(title => {
        const titleNumber = (Number(title.name) + 100).toString()
        const titleNumber3 = (Number(title.name) + 200).toString()
        const titleDouble = mapTripleSecond.get(`0000${titleNumber}`);
        const titleTriple = mapTripleThird.get(`0000${titleNumber3}`);

        if (titleDouble && titleTriple) {
          title.name_double = titleDouble.name
          title.dozens_double = titleDouble.dozens
          title.name_triple = titleTriple.name
          title.dozens_triple = titleTriple.dozens
          title.chances = 3
        }
      })

    }

    const allNotExistTitle = [
      ...notExistsBaseTitle,
      ...notExistsBaseTitleDouble,
      ...notExistsBaseTitleTriple,
    ];

    if (allNotExistTitle?.length && allNotExistTitle.length > 0) {
      await this.prisma.title.updateMany({
        where: {
          id: {
            in: allNotExistTitle.map((title) => title.id),
          },
        },
        data: {
          value: createEditionDto.value,
        },
      });
    }

    function chances(title: string) {
      const titleNumber = Number(title);
      const initalDoubleNumber = createEditionDto?.initial_title_double_chance
        ? Number(createEditionDto?.initial_title_double_chance)
        : undefined;
      const endDoubleNumber = createEditionDto?.end_title_double_chance
        ? Number(createEditionDto?.end_title_double_chance)
        : undefined;
      const initialTripleNumber = createEditionDto?.initial_title_triple_chance
        ? Number(createEditionDto?.initial_title_triple_chance)
        : undefined;
      const endTripleNumber = createEditionDto?.end_title_triple_chance
        ? Number(createEditionDto?.end_title_triple_chance)
        : undefined;

      if (
        initalDoubleNumber &&
        titleNumber >= initalDoubleNumber &&
        endDoubleNumber &&
        titleNumber <= endDoubleNumber
      ) {
        return [(Number(title) + 500000).toString()];
      }

      if (
        initialTripleNumber &&
        titleNumber >= initialTripleNumber &&
        endTripleNumber &&
        titleNumber <= endTripleNumber
      ) {
        return [
          (Number(title) + 500000).toString(),
          (Number(title) + 1000000).toString(),
        ];
      }
      return [];
    }

    function values(value: number, title: string) {
      const titleNumber = Number(title);
      const initalDoubleNumber = createEditionDto?.initial_title_double_chance
        ? Number(createEditionDto?.initial_title_double_chance)
        : undefined;
      const endDoubleNumber = createEditionDto?.end_title_double_chance
        ? Number(createEditionDto?.end_title_double_chance)
        : undefined;
      const initialTripleNumber = createEditionDto?.initial_title_triple_chance
        ? Number(createEditionDto?.initial_title_triple_chance)
        : undefined;
      const endTripleNumber = createEditionDto?.end_title_triple_chance
        ? Number(createEditionDto?.end_title_triple_chance)
        : undefined;

      if (
        initalDoubleNumber &&
        titleNumber >= initalDoubleNumber &&
        endDoubleNumber &&
        titleNumber <= endDoubleNumber
      ) {
        return createEditionDto.value_double;
      }

      if (
        initialTripleNumber &&
        titleNumber >= initialTripleNumber &&
        endTripleNumber &&
        titleNumber <= endTripleNumber
      ) {
        return createEditionDto.value_triple;
      }

      return value;
    }

    const edition = await this.prisma.edition.create({
      data: {
        name: createEditionDto.name,
        draw_date: createEditionDto.draw_date,
        order: createEditionDto.order,
        status: createEditionDto.status,
        image_url,
        image_key,
        titles: {
          connect: titlesAlreadyExists.map((title) => ({
            id: title.id,
          })),
          createMany: {
            data: allNotExistTitle.map((title) => ({
              name: title.name,
              dozens: title.dozens,
              name_double: title.name_double,
              name_triple: title.name_triple,
              dozens_double: title.dozens_double,
              dozens_triple: title.dozens_triple,
              bar_code: title.bar_code,
              qr_code: title.qr_code,
              chances: title.chances,
              value: values(createEditionDto.value, title.name),
              relation_titles: chances(title?.name),
            })),
          },
        },
      },
    });

    return edition;
  }

  async findAll() {
    const editions = await this.prisma.edition.findMany({
      orderBy: {
        order: 'asc',
      },
      include: {
        titles: true,
        fisical_titles: true,
      },
    });

    return editions;
  }

  async findAllDrawItems() {
    const drawItems = await this.prisma.drawItems.findMany({
      where: {
        edition: {
          status: 'OPEN',
        },
      },
      orderBy: {
        created_at: 'asc',
      },
      include: {
        edition: {
          include: {
            titles: true,
            fisical_titles: true,
            winners: true,
          },
        },
      },
    });

    return drawItems;
  }

  async findOne(id: string) {
    const edition = await this.prisma.edition.findFirst({
      where: { id },
      include: {
        titles: true,
        fisical_titles: true,
      },
    });

    if (!edition) {
      throw new HttpException('Edição não existe', 400);
    }

    return edition;
  }

  async update(
    id: string,
    updateEditionDto: UpdateEditionDto,
    file?: Express.Multer.File,
  ) {
    let edition = await this.prisma.edition.findFirst({
      where: { id },
      include: {
        titles: true,
        fisical_titles: true,
      },
    });

    if (!edition) {
      throw new HttpException('Edição não existe', 400);
    }

    if (edition.image_url) {
      await this.fileService.deleteFile(edition.image_key);
    }

    const titles = await this.prisma.baseTitle.findMany({
      where: {
        AND: [
          { name: { gte: updateEditionDto.initial_title } },
          { name: { lte: updateEditionDto.end_title } },
        ],
      },
    });

    const titlesAlreadyExists = await this.prisma.title.findMany({
      where: {
        name: {
          in: titles.map((title) => title.name),
        },
      },
    });

    const notExistsBaseTitle = await this.prisma.baseTitle.findMany({
      where: {
        AND: [
          { name: { gte: updateEditionDto.initial_title } },
          { name: { lte: updateEditionDto.end_title } },
        ],
        NOT: {
          name: {
            in: titlesAlreadyExists.map((title) => title.name),
          },
        },
      },
    });

    const { image_key, image_url } = await getFilesS3(this.fileService, file);

    edition = await this.prisma.edition.update({
      where: { id },
      data: {
        name: updateEditionDto.name,
        draw_date: updateEditionDto.draw_date,
        order: updateEditionDto.order,
        status: updateEditionDto.status,
        image_url,
        image_key,
        titles: {
          connect: titlesAlreadyExists.map((title) => ({
            id: title.id,
          })),
          createMany: {
            data: notExistsBaseTitle.map((title) => ({
              name: title.name,
              dozens: title.dozens,
              bar_code: title.bar_code,
              qr_code: title.qr_code,
              chances: title.chances,
              value: updateEditionDto.value,
            })),
          },
        },
      },
      include: {
        titles: {
          where: {
            user_id: null,
          },
        },
        fisical_titles: true,
      },
    });

    if (!edition) {
      throw new HttpException('Edição não existe', 400);
    }

    return edition;
  }

  async updateMany(editions: UpdateManyEditionsDto['editions']) {
    for (const receivedEdition of editions) {
      const edition = await this.prisma.edition.findFirst({
        where: { id: receivedEdition.id },
        include: {
          titles: true,
          fisical_titles: true,
        },
      });

      if (!edition) {
        throw new HttpException('Edição não existe', 400);
      }

      await this.prisma.edition.update({
        where: { id: receivedEdition.id },
        data: {
          name: receivedEdition.name,
          draw_date: receivedEdition.draw_date,
          order: receivedEdition.order,
        },
      });
    }

    return null;
  }

  async remove(id: string) {
    const edition = await this.prisma.edition.findFirst({
      where: { id },
      include: {
        titles: true,
        fisical_titles: true,
      },
    });

    if (!edition) {
      throw new HttpException('Edição não existe', 400);
    }

    await this.prisma.edition.delete({
      where: { id },
    });

    await this.prisma.title.deleteMany({
      where: {
        edition_id: id,
        buyed_title_id: { not: null },
      },
    });

    return {
      message: 'Deletado',
      status: 200,
    };
  }
}
