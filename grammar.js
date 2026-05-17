// grammar.js
module.exports = grammar({
  name: 'rangerrc',

  rules: {
    // 파일은 여러 줄(Line)로 구성됨
    source_file: $ => repeat($._line),

    _line: $ => choice(
      $.comment,
      $._command_lines,
      '\n'
    ),

    // 주석 규칙
    comment: $ => token(seq(
      repeat(choice(' ', '\t')),
      '#',
      /[^\n]*/
    )),

    // 명령어 분류 (인자 1개짜리와 2개짜리 그룹핑)
    _command_lines: $ => seq(
      choice(
        $.single_arg_command,
        $.double_arg_command
      ),
      /\s*/,
      '\n'
    ),

    // 1. 인자가 1개만 오는 명령어 (unmap, eval, default_linemode)
    single_arg_command: $ => seq(
      alias(choice('unmap', 'eval', 'default_linemode'), $.keyword),
      /\s+/,
      $.argument_value
    ),

    // 2. 인자가 2개 오는 명령어 (set, map, alias 등 나머지 전체)
    double_arg_command: $ => seq(
      alias(choice(
        'set', 'setlocal', 'map', 'cmap', 'pmap', 'tmap',
        'copymap', 'copycmap', 'copypmap', 'copytmap', 'alias'
      ), $.keyword),
      /\s+/,
      $.argument_key,    // 첫 번째 인자 (예: 옵션명, 단축키 키바인딩, 에일리언스 이름)
      /\s+/,
      $.argument_value   // 두 번째 인자 (예: 설정값, 매핑될 명령어, 에일리언스 타겟)
    ),

    // 첫 번째 인자 규칙: 다음 공백이 오기 전까지의 문자들 (단축키나 옵션명 등)
    argument_key: $ => /[^\s\n]+/,

    // 두 번째 인자(또는 단일 인자) 규칙: 줄이 끝나기 전까지의 모든 문자 (띄어쓰기, 정규식, 특수문자 포함)
    argument_value: $ => /[^\n]+/
  }
});