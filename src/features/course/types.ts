export type Lesson = {
  id: number;
  courseId: number;
  number: number;
  name: string;
  objectives: string[];
};

export type Course = {
  id: number;
  categoryId: number;
  name: string;
  lessons: Lesson[];
};

export type Category = {
  id: number;
  name: string;
};

export type FullCourse = Course & {
  category: Category;
  lessons: Lesson[];
};

export type CourseWithCategory = Course & { category: Category };
